export class Fraction{
    constructor(text){
        if(text.includes("|")){
            this.whole=BigInt(text.split("|")[0]);
            var fractionTexts=text.split("|")[1].split(".");
            this.fraction=[];
            for(var i=0; i<fractionTexts.length; i++){
                if(i%2!=0) // normal place
                    this.fraction.push(BigInt(fractionTexts[i]));
                else if(i%2==0) // opposite place
                    this.fraction.push(BigInt(fractionTexts[i].replace("'", "")));
            }
        }else{
            this.whole=BigInt(text);
            this.fraction=[];
        }
    }
    text(){
        if(this.fraction.length==0)
            return String(this.whole);
        else{
            var text=String(this.whole)+"|";
            for(var i=0; i<this.fraction.length; i++){
                if(i%2!=0) // normal place
                    text+=String(this.fraction[i]);
                else if(i%2==0) // opposite place
                    text+=String(this.fraction[i])+"'";
                
                if(i!=this.fraction.length-1)
                    text+=".";
            }
            return text;
        }
    }
    copy(){
        return new Fraction(this.text());
    }

    compare(next){
        if(this.whole>next.whole)
            return ">";
        else if(this.whole<next.whole)
            return "<";
        else if(this.whole==next.whole){
            for(var i=0; i<Math.min(this.fraction.length, next.fraction.length); i++){
                if(i%2!=0){ // normal place
                    if(this.fraction[i]>next.fraction[i])
                        return ">";
                    else if(this.fraction[i]<next.fraction[i])
                        return "<";
                }else if(i%2==0){ // opposite place
                    if(this.fraction[i]>next.fraction[i])
                        return "<";
                    else if(this.fraction[i]<next.fraction[i])
                        return ">";
                }
            }
            if(this.fraction.length==next.fraction.length)
                return "=";
            else{
                var place=Math.min(this.fraction.length, next.fraction.length);
                if(place%2!=0){ // normal place
                    if(this.fraction.length>next.fraction.length)
                        return "<";
                    else if(next.fraction.length>this.fraction.length)
                        return ">";
                }else if(place%2==0){ // opposite place
                    if(this.fraction.length>next.fraction.length)
                        return ">";
                    else if(next.fraction.length>this.fraction.length)
                        return "<";
                }
            }
        }
    }
    equals(next){return this.compare(next)=="=";}
    greater(next){return this.compare(next)==">";}
    less(next){return this.compare(next)=="<";}
    greaterEqual(next){return this.compare(next)==">"||this.compare(next)=="=";}
    lessEqual(next){return this.compare(next)=="<"||this.compare(next)=="=";}

    calculate(next, operation){
        var firstUp=0n;
        var firstDown=1n;
        for(var i=this.fraction.length-1; i>=0; i--){
            firstUp=firstDown*this.fraction[i]+firstUp;

            var temp=firstUp;
            firstUp=firstDown;
            firstDown=temp;
        }
        firstUp=firstDown*this.whole+firstUp;

        var nextUp=0n;
        var nextDown=1n;
        for(var i=next.fraction.length-1; i>=0; i--){
            nextUp=nextDown*next.fraction[i]+nextUp;

            var temp=nextUp;
            nextUp=nextDown;
            nextDown=temp;
        }
        nextUp=nextDown*next.whole+nextUp;

        var answerUp;
        var answerDown;
        if(operation=="+"){
            answerUp=firstUp*nextDown+nextUp*firstDown;
            answerDown=firstDown*nextDown;
        }else if(operation=="-"){
            answerUp=firstUp*nextDown-nextUp*firstDown;
            answerDown=firstDown*nextDown;
        }else if(operation=="*"){
            answerUp=firstUp*nextUp;
            answerDown=firstDown*nextDown;
        }else if(operation=="/"){
            answerUp=firstUp*nextDown;
            answerDown=firstDown*nextUp;
        }

        var answer=new Fraction("0");
        answer.whole=answerUp/answerDown;
        answerUp=answerUp%answerDown;
        while(answerUp!=0n){
            var temp=answerUp;
            answerUp=answerDown;
            answerDown=temp;

            answer.fraction.push(answerUp/answerDown);
            answerUp=answerUp%answerDown;
        }
        return answer;
    }
    addition(next){return this.calculate(next, "+");}
    subtraction(next){return this.calculate(next, "-");}
    multiplication(next){return this.calculate(next, "*");}
    division(next){return this.calculate(next, "/");}
}
export class SignedFraction{
    constructor(text){
        if(text=="0"){
            this.sign="";
            this.value=new Fraction("0");
        }else if(text[0]!="-"){ // positive
            this.sign="+";
            this.value=new Fraction(text);
        }else if(text[0]=="-"){ // negative
            this.sign="-";
            this.value=new Fraction(text.replace("-", ""));
        }
    }
    text(){
        if(this.sign=="")
            return "0";
        else if(this.sign=="+")
            return this.value.text();
        else if(this.sign=="-")
            return "-"+this.value.text();
    }
    copy(){
        return new SignedFraction(this.text());
    }

    compare(next){
        if(this.sign=="+"&&next.sign=="+"){
            if(this.value.greater(next.value))
                return ">";
            else if(this.value.less(next.value))
                return "<";
            else if(this.value.equals(next.value))
                return "=";
        }else if(this.sign=="+"&&next.sign=="-")
            return ">";
        else if(this.sign=="+"&&next.sign=="")
            return ">";
        else if(this.sign=="-"&&next.sign=="+")
            return "<";
        else if(this.sign=="-"&&next.sign=="-"){
            if(this.value.greater(next.value))
                return "<";
            else if(this.value.less(next.value))
                return ">";
            else if(this.value.equals(next.value))
                return "=";
        }else if(this.sign=="-"&&next.sign=="")
            return "<";
        else if(this.sign==""&&next.sign=="+")
            return "<";
        else if(this.sign==""&&next.sign=="-")
            return ">";
        else if(this.sign==""&&next.sign=="")
            return "=";
    }
    equals(next){return this.compare(next)=="=";}
    greater(next){return this.compare(next)==">";}
    less(next){return this.compare(next)=="<";}
    greaterEqual(next){return this.compare(next)==">"||this.compare(next)=="=";}
    lessEqual(next){return this.compare(next)=="<"||this.compare(next)=="=";}

    addition(next){
        if(this.equals(new SignedFraction("0")))
            return next.copy();
        else if(next.equals(new SignedFraction("0")))
            return this.copy();

        var answer=new SignedFraction("0");
        if(this.sign==next.sign){
            answer.sign=this.sign;
            answer.value=this.value.addition(next.value);
        }else{
            if(this.value.greater(next.value)){
                answer.sign=this.sign;
                answer.value=this.value.subtraction(next.value);
            }else if(next.value.greater(this.value)){
                answer.sign=next.sign;
                answer.value=next.value.subtraction(this.value);
            }else if(this.value.equals(next.value)){
                answer.sign="";
                answer.value=new Fraction("0");
            }
        }
        return answer;
    }
    subtraction(next){
        if(next.equals(new SignedFraction("0")))
            return this.copy();
        
        var signChanged=next.copy();
        if(next.sign=="+")
            signChanged.sign="-";
        else if(next.sign=="-")
            signChanged.sign="+";
        return this.addition(signChanged);
    }
    multiplication(next){
        if(this.equals(new SignedFraction("0"))||next.equals(new SignedFraction("0")))
            return new SignedFraction("0");
        
        var answer=new SignedFraction("0");
        answer.value=this.value.multiplication(next.value);
        if(this.sign=="+"&&next.sign=="+")
            answer.sign="+";
        else if(this.sign=="+"&&next.sign=="-")
            answer.sign="-";
        else if(this.sign=="-"&&next.sign=="+")
            answer.sign="-";
        else if(this.sign=="-"&&next.sign=="-")
            answer.sign="+";
        return answer;
    }
    division(next){
        if(this.equals(new SignedFraction("0")))
            return new SignedFraction("0");
        
        var answer=new SignedFraction("0");
        answer.value=this.value.division(next.value);
        if(this.sign=="+"&&next.sign=="+")
            answer.sign="+";
        else if(this.sign=="+"&&next.sign=="-")
            answer.sign="-";
        else if(this.sign=="-"&&next.sign=="+")
            answer.sign="-";
        else if(this.sign=="-"&&next.sign=="-")
            answer.sign="+";
        return answer;
    }
}