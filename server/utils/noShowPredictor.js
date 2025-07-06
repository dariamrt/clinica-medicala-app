const tf = require('@tensorflow/tfjs-node');
const { Appointment, Patient, Doctor } = require('../models');

async function prepareTrainingData() {
    const appointments = await Appointment.findAll({
        attributes: ['id', 'date', 'start_time', 'status', 'patient_id'],
        include: [
            { 
                model: Patient, 
                attributes: ['gender', 'user_id'],
                as: 'Patients_Datum', 
                required: false 
            },
            { 
                model: Doctor, 
                attributes: ['specialty_id'],
                as: 'Doctors_Datum',
                required: false
            }
        ]
    });

    let X = [];
    let Y = [];
    let canceledAppointments = [];
    let confirmedAppointments = [];

    for (const app of appointments) {
        if (!app.Patients_Datum || !app.Patients_Datum.gender || !app.start_time) {
            console.warn("Skipping appointment with missing patient data:", app);
            continue;
        }

        const appointmentDate = new Date(app.date);
        const [hours, minutes] = app.start_time ? app.start_time.split(":").map(Number) : [8, 0];
        appointmentDate.setHours(hours, minutes);

        const patientAge = await calculateAgeFromPatientId(app.Patients_Datum.user_id);
        const previousCancellations = await Appointment.count({
            where: { patient_id: app.patient_id, status: "cancelled" }
        });
        
        const input = [
            patientAge,
            appointmentDate.getDay(),
            hours < 12 ? 1 : 0,
            app.Patients_Datum.gender === 'male' ? 0 : 1,
            previousCancellations
        ];

        const label = app.status === 'cancelled' ? 1 : 0;

        if (label === 1) {
            canceledAppointments.push({ input, label });
        } else {
            confirmedAppointments.push({ input, label });
        }
    }

    const sampleSize = Math.min(canceledAppointments.length, confirmedAppointments.length);
    const balancedData = canceledAppointments.slice(0, sampleSize).concat(confirmedAppointments.slice(0, sampleSize));

    balancedData.forEach(({ input, label }) => {
        X.push(input);
        Y.push(label);
    });

    console.log(`Training Data Distribution: ${canceledAppointments.length} canceled, ${confirmedAppointments.length} confirmed`);

    return { X, Y };
}

async function calculateAgeFromPatientId(userId) {
    try {
        const patient = await Patient.findOne({ 
            where: { user_id: userId }, 
            attributes: ['CNP'] 
        });
        
        if (!patient || !patient.CNP) return 0;

        const centuryPrefix = patient.CNP[0] === '1' || patient.CNP[0] === '2' ? "19" : "20";
        const birthYear = parseInt(centuryPrefix + patient.CNP.substring(1, 3));
        return new Date().getFullYear() - birthYear;
    } catch (error) {
        console.error('Error calculating age from patient ID:', error);
        return 0;
    }
}

async function trainModel() {
    const { X, Y } = await prepareTrainingData();

    if (X.length === 0 || Y.length === 0) {
        throw new Error("No training data available. Ensure database has appointments.");
    }

    const X_train = tf.tensor2d(X, [X.length, X[0].length]); 
    const Y_train = tf.tensor2d(Y, [Y.length, 1]);  

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [X[0].length] }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); 

    model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    const classWeight = {
        0: 1.0,  
        1: 2.0  
    };

    console.log("Class Weights:", classWeight);

    await model.fit(X_train, Y_train, {
        epochs: 50,
        batchSize: 8,
        classWeight
    });

    console.log('Model trained successfully!');

    return model;
}

async function predictNoShow(age, gender, date, start_time = "08:00", previousCancellations = 0) {
    const model = await trainModel();

    console.log("PredictNoShow - Raw Inputs:", { age, gender, date, start_time, previousCancellations });

    age = age !== undefined && age !== null ? parseFloat(age) : 0;
    gender = gender !== undefined && gender !== null ? gender.toLowerCase() : "male";
    date = date !== undefined && date !== null ? date : new Date().toISOString().split("T")[0];
    start_time = start_time !== undefined && start_time !== null ? start_time : "08:00";
    previousCancellations = previousCancellations !== undefined && previousCancellations !== null ? parseInt(previousCancellations) : 0;

    const appointmentDate = new Date(date);
    let hours, minutes;
    
    try {
        [hours, minutes] = start_time.split(":").map(Number);
    } catch (error) {
        console.warn("Invalid start_time format, using default 08:00");
        hours = 8;
        minutes = 0;
    }

    console.log("Processed Inputs:", { age, gender, date, start_time, previousCancellations, hours, minutes });

    const inputArray = [[ 
        age,
        appointmentDate.getDay(),
        hours < 12 ? 1 : 0,
        gender === 'male' ? 0 : 1,
        previousCancellations
    ]];

    if (inputArray[0].some(val => isNaN(val) || val === null || val === undefined)) {
        console.error("Invalid input array:", inputArray);
        throw new Error("Invalid input values. Check age, gender, date, start_time, and previousCancellations.");
    }

    const inputTensor = tf.tensor2d(inputArray, [1, inputArray[0].length]);

    const prediction = model.predict(inputTensor);
    const probability = (await prediction.data())[0]; 

    console.log(`Predicted probability: ${probability}`);
    return probability > 0.7 ? "High Risk of No-Show" : probability > 0.4 ? "Medium Risk of No-Show" : "Low Risk";
}

module.exports = { 
    prepareTrainingData,
    trainModel,
    predictNoShow,
    calculateAgeFromPatientId
};
