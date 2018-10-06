function updateParamDisplay(features) {
  for(let i = 0;i < numFeatures;i ++) {
    document.getElementById("param" + i).innerHTML = features[i];
  }
}