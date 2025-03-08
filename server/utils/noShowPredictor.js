const tf = require('@tensorflow/tfjs-node');
const { Appointment, Patient, Doctor } = require('../models');

async function prepareTrainingData() {
    const appointments = await Appointment.findAll({
        attributes: ['id', 'date', 'status'],  // extract the date and status of the appointment
        include: [
            { model: Patient, attributes: ['age', 'gender'] },
            { model: Doctor, attributes: ['specialty_id'] }
        ]
    });

    const X = [];
    const Y = [];

    appointments.forEach(app => {
        const input = [
            app.Patient.age,  
            app.Patient.gender === 'male' ? 0 : 1, // coverted the gender to numerical => male=0, female=1)
            new Date(app.date).getDay(), //convert to numbers the day of the week (0=Sunday, 6=Saturday)
            new Date(app.date).getHours() < 12 ? 1 : 0, // morning = 1 or afternoon = 0 
            app.status === 'canceled' ? 1 : 0 // if they canceled in the past
        ];

        X.push(input);
        Y.push(app.status === 'canceled' ? 1 : 0); // 1 = No-show, 0 = Showed up
    });

    return { X, Y };
}

async function trainModel() {
    const { X, Y } = await prepareTrainingData();

    const X_train = tf.tensor2d(X);
    const Y_train = tf.tensor2d(Y, [Y.length, 1]);  // labels are a column vector

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [X[0].length] }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // used Sigmoid for binary classification

    model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    await model.fit(X_train, Y_train, {
        epochs: 50, // trained the model for 50 iterations
        batchSize: 8
    });

    console.log('Model trained successfully!');

    return model;
}

async function predictNoShow(patientAge, gender, date) {
    const model = await trainModel(); // train or load a trained model

    const input = tf.tensor2d([[ 
        patientAge,
        gender === 'male' ? 0 : 1,
        new Date(date).getDay(),
        new Date(date).getHours() < 12 ? 1 : 0,
        0 // assume there are no past cancellations now
    ]]);

    const prediction = model.predict(input);
    const probability = prediction.dataSync()[0]; // get prediction probability

    return probability > 0.5 ? "High Risk of No-Show" : "Low Risk";
}

module.exports = { prepareTrainingData, trainModel, predictNoShow };
