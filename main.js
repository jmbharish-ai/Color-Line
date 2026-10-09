import {Fraction} from './Fraction.js';

const divisions=18;

function createLine(){
    var redGreen;
    if(document.getElementById("redGreen").value=="0") redGreen="red";
    else redGreen="green";
    var blueYellow;
    if(document.getElementById("blueYellow").value=="0") blueYellow="blue";
    else blueYellow="yellow";

    var upLuminance=value("upLuminance");
    var upRedGreen=value("upRedGreen");
    var upBlueYellow=value("upBlueYellow");
    var downLuminance=value("downLuminance");
    var downRedGreen=value("downRedGreen");
    var downBlueYellow=value("downBlueYellow");
    function value(id){return new Fraction(document.getElementById(id).value);}

    for(var i=0; i<=divisions; i++){
        var theLuminance=theMix(upLuminance, downLuminance, i);
        var theRedGreen=theMix(upRedGreen, downRedGreen, i);
        var theBlueYellow=theMix(upBlueYellow, downBlueYellow, i);
        document.getElementById(String(i)).style.backgroundColor=color(theLuminance, redGreen, theRedGreen, blueYellow, theBlueYellow);
        function theMix(first, next, number){return mix(first, next, fraction("1").subtraction(fraction(number).division(fraction(divisions))));}
        function fraction(textOrNumber){return new Fraction(String(textOrNumber));}
    }

    function mix(first, next, amount){
        var oppositeAmount=new Fraction("1").subtraction(amount);
        var firstPart=first.multiplication(amount);
        var nextPart=next.multiplication(oppositeAmount);
        return firstPart.addition(nextPart);
    }
}
window.createLine=createLine;

function color(luminance, redGreen, redGreenValue, blueYellow, blueYellowValue){
    var red=new Fraction("1");
    var green=new Fraction("1");
    var blue=new Fraction("1");
    if(redGreenValue.greaterEqual(blueYellowValue)){
        if(redGreen=="red"){
            green=green.subtraction(redGreenValue);
            blue=blue.subtraction(redGreenValue);
            if(blueYellow=="blue") blue=blue.addition(blueYellowValue);
            else if(blueYellow=="yellow") green=green.addition(blueYellowValue.division(new Fraction("2")));
        }else if(redGreen=="green"){
            red=red.subtraction(redGreenValue);
            blue=blue.subtraction(redGreenValue);
            if(blueYellow=="blue") blue=blue.addition(blueYellowValue);
            else if(blueYellow=="yellow") red=red.addition(blueYellowValue.division(new Fraction("2")));
        }
    }else if(blueYellowValue.greaterEqual(redGreenValue)){
        if(blueYellow=="blue"){
            red=red.subtraction(blueYellowValue);
            green=green.subtraction(blueYellowValue);
            if(redGreen=="red") red=red.addition(redGreenValue);
            else if(redGreen=="green") green=green.addition(redGreenValue);
        }else if(blueYellow=="yellow"){
            blue=blue.subtraction(blueYellowValue);
            if(redGreen=="red") green=green.subtraction(redGreenValue.division(new Fraction("2")));
            else if(redGreen=="green") red=red.subtraction(redGreenValue.division(new Fraction("2")));
        }
    }
    red=luminance.multiplication(red);
    green=luminance.multiplication(green);
    blue=luminance.multiplication(blue);
    red=red.multiplication(new Fraction("255")).whole;
    green=green.multiplication(new Fraction("255")).whole;
    blue=blue.multiplication(new Fraction("255")).whole;
    return "rgb("+red+", "+green+", "+blue+")";
}
window.color=color;