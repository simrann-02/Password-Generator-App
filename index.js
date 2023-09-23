const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMessage]");
const upperCaseCheck= document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#%^&*(){}:";<>,./?';
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

//set password length
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize= ( (passwordLength-min)/(max-min) *100) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasSym=false;
    let hasNum=false;

    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(symbolsCheck.checked) hasSym=true;
    if(numbersCheck.checked) hasNum=true;

    if(hasUpper && hasLower &&(hasSym||hasNum) && passwordLength>=8)
    setIndicator('#0f0');
    else if((hasUpper||hasLower) && (hasNum||hasSym) && passwordLength>=6)
    setIndicator('#0ff');
    else 
    setIndicator('#f00');
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied';
    }
    catch(e){
        copyMsg.innerText='failed';
    }
    copyMsg.classList.add("active");
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

copyBtn.addEventListener('click',(value)=>{
    if(passwordDisplay.value)
    {
    copyContent();
    }
})


function handleCheckBoxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
        checkCount++;
        }
    });
    //special condition
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    
    checkbox.addEventListener('change',handleCheckBoxChange);
})

function shufflePassword(array){
//fisher Yates algo
for(let i=0;i<array.length-1;i++){
    const j=Math.floor(Math.random()*(i+1));
    const temp=array[i];
    array[i]=array[j];
    array[j]=temp;
}
let str="";
array.forEach((el)=>{(str+=el)});
return str;
}

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return;

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    password="";

    let funcArr=[];
    if(upperCaseCheck.checked)
    funcArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funcArr.push(getRandomNumber);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
        let randIdx=getRandomInteger(0,funcArr.length);
        password += funcArr[randIdx]();
    }

    password=shufflePassword(Array.from(password));
    
    passwordDisplay.value=password;
    calcStrength();
})

