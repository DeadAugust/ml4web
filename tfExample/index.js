/*
// Create a rank-2 tensor (matrix) matrix tensor from a multidimensional array.
const a = tf.tensor([[1, 2], [3, 4]]);
console.log('shape:', a.shape);
a.print();

// Returns the multi dimensional array of values.
a.array().then(array => console.log(array));
// Returns the flattened data that backs the tensor.
a.data().then(data => console.log(data));

// Or you can create a tensor from a flat array and specify a shape.
const shape = [2, 2];
const b = tf.tensor([1, 2, 3, 4], shape);
console.log('shape:', b.shape);
b.print();
*/

// const model = tf.sequential({
//   layers: [
//     tf.layers.dense({inputShape: [1], units: })
//   ]
// })
//config model
const model = tf.sequential();


//config each layer
const configHidden = {
  inputShape: [5],
  units: 4,
  activation: 'sigmoid'
}
const hidden = tf.layers.dense(configHidden);

const configOutput = {
  units: 2,
  activation: 'sigmoid'
}
const output = tf.layers.dense(configOutput);

//add layers to the model
model.add(hidden);
model.add(output);

console.log(hidden);
// hidden.print();
console.log(output);

const sgdOpt = tf.train.sgd(0.1);
const config = {
  optimizer: sgdOpt,
  loss: 'meanSquaredError'
}
model.compile(config);

console.log(model);
tf.print(model);
//don't need predict for NeurEvo
let outputs = model.predict(tf.tensor2d([
  [0.25, 0.92, 0.3, 0.23, 0.11]
]));
console.log(outputs);


//tensors tracked
console.log(tf.memory());

//which  backend -- webGL
// console.log(tf.getBackend());



// let net;
//
// async function app() {
//   console.log('Loading mobilenet..');
//
//   // Load the model.
//   net = await mobilenet.load();
//   console.log('Sucessfully loaded model');
//
//   // Make a prediction through the model on our image.
//   const imgEl = document.getElementById('img');
//   const result = await net.classify(imgEl);
//   console.log(result);
// }
//
// app();
