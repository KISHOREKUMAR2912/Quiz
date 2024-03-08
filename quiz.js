import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class Quiz extends LightningElement {
    quizQuestions=[{
                    question:"Who won the 10th Italian Open title in 2021?",
                    options:["Novack Djokovic","Rafael Nadal","Dominic Thiem","Stefanos Tsitsipas"],
                    correct:"Rafael Nadal"},
                    {
                    question:"Who has won most no of Ballon DOR's?",
                    options:["Ronaldo","Pele","Messi","Neymar"],
                    correct:"Messi"},
                    {
                    question:"Who won the CWC World Cup Winner in 2023?",
                    options:["IND","SA","NZ","AUS"],
                    correct:"AUS"},
                    {
                    question:"Thomas Cup and Uber Cup are prestigious trophies of which sport?",
                    options:["Badminton","Lawn Tennis","Table Tennis","Golf"],
                    correct:"Badminton"}];
    currentIndexValue=0;boolValue=false;indexOptions;selectedValue='';
    options;questionOptions;score=0;isdisabled=false;correctOption; scoreGreeting;
    userName;userEmail;isQuiz=false;nextDisable=false;playAgain=true;
    @track elapsedSecs = 0;@track elapsedMins=0; 
    timer; 

    handleChange(event){
        const {name,value} = event.target;
        if(name=="Name"){
            this.userName=value;
        }
        if(name=="Email"){
            this.userEmail=value;
        }
    }
    handleClick(event){
        this.dispatchEvent(new ShowToastEvent({
            title:"Quiz Instructions",
            message:`1. Only one option is allowed  2. Each Correct Option carries 100 marks 
                    3. No negative marks on selecting wrong option`,
            variant:"warning",
            mode:"sticky"
        }))
        this.boolValue=true;
        this.startStopwatch();
        console.log("Options...")
    }

    get currentItem(){
        this.indexOptions=this.quizQuestions[this.currentIndexValue].options;
        console.log(JSON.stringify(this.indexOptions))
        this.options = this.indexOptions.map(x=>{
            return{label:x,value:x}
        })
        console.log(JSON.stringify(this.options))
        this.questionOptions=JSON.parse(JSON.stringify(this.options))
        return this.quizQuestions[this.currentIndexValue];
    }

    handleValue(event){
        this.selectedValue=Object.values(event.detail.value)[0];
        console.log('value selected: '+this.selectedValue)
        console.log(typeof( this.selectedValue))
        this.isdisabled=true;
        this.correctOption=JSON.parse(JSON.stringify(this.quizQuestions[this.currentIndexValue].correct))
        console.log(this.correctOption)
        console.log(typeof(this.correctOption))
        if(this.selectedValue==this.correctOption){
            this.score+=100;
            console.log(this.score)
        }
    }
    startStopwatch(){
        this.timer=setInterval(() => {
            this.elapsedSecs += 1;
            if(this.elapsedSecs==60){
                this.elapsedMins+=1;
                this.elapsedSecs=0;
            } 
        }, 1000);
    }

    handleNext(event){
        if(this.currentIndexValue<this.quizQuestions.length-1){
            this.currentIndexValue+=1;
        }
        if(this.currentIndexValue==this.quizQuestions.length-1){
            this.nextDisable=true;
            this.playAgain=false;
        }
        this.isdisabled=false;
    }
    handlePlayAgain(){
        this.boolValue=true;
        this.resetValues();
        this.startStopwatch();
    }
    handleFinish(event){
        this.dispatchEvent(new ShowToastEvent({
            title:"Quiz Got Finished!!!",
            variant:"success"
        }))
        this.isQuiz=true;
        clearInterval(this.timer);
        if(this.score>100){
            this.scoreGreeting="Congrats!!!, ";
        }
        else{
            this.scoreGreeting="Better Luck Next Time, "
        }
    }
    handleClose(event){
        this.boolValue=false;
        this.resetValues();
        this.userName=null;
        this.selectedValue='';
    }
    resetValues(){
        this.score=0;
        this.currentIndexValue=0;
        this.playAgain=true;
        this.isQuiz=false;
        this.isdisabled=false;
        this.nextDisable=false;
        this.elapsedMins = 0;
        this.elapsedSecs = 0;
        clearInterval(this.timer);
    }
}