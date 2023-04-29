const inputbox=document.getElementById("input-box");
const listcontainer=document.getElementById("list-container");//connecting with html

function addtask(){
    if(inputbox.value===''){
        alert("you must wirte something ");
    }//add task is in html .we are using this bez to add the search in the screen .when the input box is empty then you must write smomething is added 
else{
    let li=document.createElement("li");//storing data in li 
    li.innerHTML =inputbox.value;
    listcontainer.appendChild(li);//li was displayed in list
    let span =document.createElement("span");
    span.innerHTML="\u00d7";//x icon 
    li.appendChild(span); //display x icon
   

}
inputbox.value=""; // to delete what we have searched .but it was saved and displayed
saveData();//when nw data was called the new data was called and saved

}
 listcontainer.addEventListener("click",function(e){

 
    if(e.target.tagName==="LI"){
        e.target.classlist.toggle("checked");
        saveData();


    }//if details are  is true it will work
    else if(e.target.tagName==="SPAN"){
    e.target.parentElement.remove();
    saveData();
}//if details are  is false it will work

},false);
function saveData(){
    localStorage.setItem("data",listcontainer.innerHTML);
}
function showTask(){
    listcontainer.innerHTML=localStorage.getItem("data");
}
showTask();// weare calling the function