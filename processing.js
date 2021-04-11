var model;
async function loadModel() {
    model= await tf.loadGraphModel(`TFJS/model.json`);
  }
function predictImage(){
   
    let image= cv.imread(canvas);
    cv.cvtColor(image,image, cv.COLOR_RGBA2GRAY,0);
    cv.threshold(image,image,175,255, cv.THRESH_BINARY);

    let contours= new cv.MatVector();
    let hierachy = new cv.Mat();

    cv.findContours(image, contours, hierachy , cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);


    let cnt= contours.get(0);
    let rect = cv.boundingRect(cnt);
    image=image.roi(rect);

  
    
    var height=image.rows;
    var width =image.cols;
    if (height>width){
        height=20;
        const desize=image.rows/20;
        width=Math.round(image.cols/desize);
    }
    else {
        width=20;
        const desize=image.cols/20;
        height=Math.round(image.rows/desize);
    }
    let newSize=new cv.Size(width,height);
    cv.resize(image,image,newSize,0,0,cv.INTER_AREA)

    const LEFT=Math.ceil(4+(20-width)/2);
    const RIGHT=Math.floor(4+(20-width)/2);
    const TOP=Math.ceil(4+(20-height)/2);
    const BOTTOM=Math.floor(4+(20-height)/2);
    //console.log(`top: ${TOP}, bottom: ${BOTTOM} , left: ${LEFT}, right: ${RIGHT}`);
    
    
    const BLACK=new cv.Scalar(0,0,0,0);
    cv.copyMakeBorder(image,image,TOP,BOTTOM,LEFT,RIGHT,cv.BORDER_CONSTANT,BLACK);
    
    //Centre of Mass
    cv.findContours(image, contours, hierachy , cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt=contours.get(0);
    const Moments =cv.moments(cnt,false);

    const cx= Moments.m10 / Moments.m00;
    const cy= Moments.m01 / Moments.m00;
    //console.log(`Centre of Mass : ${cx} ${cy}`);

    //Shifting Image to the Centre

    const X_SHIFT=Math.round(image.cols/2.0-cx);
    const Y_SHIFT=Math.round(image.rows/2.0-cy);
    
    let M =cv.matFromArray(2,3,cv.CV_64FC1,[1,0,X_SHIFT,0,1,Y_SHIFT]);
    let dsize= new cv.Size(image.rows,image.cols);
    cv.warpAffine(image,image,M,dsize,cv.INTER_LINEAR,cv.BORDER_CONSTANT,BLACK);


    let pixelValues=image.data;
    
    pixelValues=Float32Array.from(pixelValues);

    pixelValues=pixelValues.map(function(item){
        return item/255.0;
    });

   // console.log(`scaled array: ${pixelValues}`);

    const X = tf.tensor([pixelValues]);
    //console.log(`shape of tensor ${X.shape}`);
   // console.log(`dtype of Tensor: ${X.dtype}`);

    //Prediction
    const result=model.predict(X);
    result.print();
    //console.log(tf.memory());

    const output =result.dataSync()[0];
    //Delete Later , only for testing
    //const outputCanvas=document.createElement('CANVAS');
    //cv.imshow(outputCanvas, image);
    //document.body.appendChild(outputCanvas);


    X.dispose();
    result.dispose();
    image.delete();
    contours.delete();
    hierachy.delete();
    cnt.delete();
    M.delete();

    return output;
}
