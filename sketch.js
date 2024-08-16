let perceptron; //Globally declaring the perceptron

function setup() {
  createCanvas(400, 400);
  perceptron = new Perceptron(); 
  trainingData = generateTrainingData(100);
  currentDataIndex = 0;
}

//Creating training data where we create two inputs x and y and then label which is the right output
function generateTrainingData(numPoints){
  let trainingData = [];
  for(let i = 0;i<numPoints;i++){
      let x = Math.random()*2-1; //This keeps the random between -1 and 1
      let y = Math.random()*2-1;
      let label = (y>x) ? 1:-1;
      trainingData.push({inputs:[x,y],label: label});//pushing the two inputs with the label
  }
  return trainingData;
}

//Creating a perceptron
class Perceptron{
  constructor(){
      this.weights = new Array(3);
      this.learningRate = 0.5;//How fast weights of the perceptron adapts
      this.bias = 1;
      for(let i = 0;i<this.weights.length;i++){
          this.weights[i] = Math.random()*2 -1;//assigning random initial weights 
      }
  }
//guess function to guess the output or the label
  guess(inputs){
      let weightedSum = 0;
      for(let i = 0;i<inputs.length;i++){
          weightedSum += inputs[i]*this.weights[i];//xW1 + yW2 = weighted sum
      }
      weightedSum += 1 * this.weights[this.weights.length-1];//adding bias to the sum 
      let output = activationFunction(weightedSum);//it's passed into an activation function
      return output;
  }
//supervised learning
  train(trainingData){
      for(let i = 0;i<trainingData.length;i++){
          let guessMade = this.guess(trainingData[i].inputs);
          let error = trainingData[i].label - guessMade;

          //Tuning the weights 
          for(let j = 0;j< trainingData[i].inputs.length;j++){
              this.weights[j] += error * trainingData[i].inputs[j] * this.learningRate; //weight = weight + error x input x learning rate
          }

          this.weights[this.weights.length-1] += error * 1 * this.learningRate;//updating bias
      }
  }

}

//Creating an Activation function
function activationFunction(sum){
  if(sum > 0){
      return 1;
  }else{
      return -1;
  }
}

function drawDecisionBoundary() {
  // wX * x + wY * y  + b = 0
  let x1 = -1;
  let y1 = -(perceptron.weights[0] / perceptron.weights[1]) * x1 - (perceptron.weights[2] / perceptron.weights[1]);  // Calculate y1 for x1 = -1  
  let x2 = 1;
  let y2 = -(perceptron.weights[0] / perceptron.weights[1]) * x2 - (perceptron.weights[2] / perceptron.weights[1]);  // Calculate y2 for x2 = 1

  // Map these points to canvas coordinates
  let x1Mapped = map(x1, -1, 1, 0, width);
  let y1Mapped = map(y1, -1, 1, height, 0);  // Flip y-axis for p5.js
  let x2Mapped = map(x2, -1, 1, 0, width);
  let y2Mapped = map(y2, -1, 1, height, 0);  // Flip y-axis for p5.js

  // Draw the line representing the decision boundary
  stroke(0);  // Set the color of the line to black
  line(x1Mapped, y1Mapped, x2Mapped, y2Mapped);  // Draw the line
}

function draw() {
  background(220);

  // Visualize the perceptron's output on each data point
  for (let i = 0; i < trainingData.length; i++) {
    let guess = perceptron.guess(trainingData[i].inputs);
    let x = map(trainingData[i].inputs[0], -1, 1, 0, width);
    let y = map(trainingData[i].inputs[1], -1, 1, height, 0);
    if (guess > 0) {
      fill('blue');  // Gray for a positive output (+1)
    } else {
      fill('red');  // White for a negative output (-1)
    }
    strokeWeight(1);
    stroke(0);
    ellipse(x, y, 8, 8);
  }

  // Train the perceptron on one data point per frame
  perceptron.train([trainingData[currentDataIndex]]);
  currentDataIndex = (currentDataIndex + 1) % trainingData.length;  // Loop through the data

  // Visualize the decision boundary
  drawDecisionBoundary();
  
}










