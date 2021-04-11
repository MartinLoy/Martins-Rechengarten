var answer;
var score=0;
var backgroundImages=[];
function nextQuestion(){
    const n1=Math.floor(Math.random()*5)
    document.getElementById('n1').innerHTML=n1;
    const n2=Math.floor(Math.random()*6)
    document.getElementById('n2').innerHTML=n2;
    answer=n1+n2
}

function checkAnswer(){
    const prediction= predictImage();
    console.log(`answer: ${answer} and prediction ${prediction}`);
    if (prediction== answer){
        score++;
        console.log(`correct! ${score}`);
        backgroundImages.push(`url('images/background${score}.svg')`);
        document.body.style.backgroundImage=backgroundImages;
        if (score==6){
            alert("Glückwusch! Schaffst du es nochmal?");
            score=0;
            document.body.style.backgroundImage=[];
            backgroundImages=[]
        }
    }
    else{
        if (score!=0){
            score--;}
            console.log(`wrong! ${score}`);
            alert("Leider nicht richtig..");
            setTimeout(function(){
                backgroundImages.pop();
                document.body.style.backgroundImage=backgroundImages;

            },500)
            
        }
}