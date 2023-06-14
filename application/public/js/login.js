document.getElementById("login_form").addEventListener("submit" , function(ev) {
    ev.preventDefault();
    console.log(ev);
    ValidateLogIn();
});
      

function ValidateLogIn(){  
    function ValidateUser(){
        document.getElementById("uname").addEventListener("input" , function(ev) {
            let userinput = ev.currentTarget;
            let username = userinput.value ;

                if ( username.length === ""){
                    userinput.style.color = "red" ;
                }
                else if (username.length < 3 || username.length >15 ) {
                    userinput.style.color = "red" ;
                }
                else if (/^(?=.{4})[a-z][a-z\d]*_?[a-z\d]+$/i.test(username) === false){
                    return userinput.style.color = "red";
                }
                else {
                    return userinput.style.color = "green";
                }
        
        });
    };    

    function ValidatePass(){
        document.getElementById("pword").addEventListener("input" , function(ev){
            let userinput = ev.currentTarget;
            let password = userinput.value ;

                if (password.length === " " ) {
                    userinput.style.color = "red" ;
                }
                else if (password.length < 8 || password.length > 24) {
                    userinput.style.color = "red" ;
                } 
                else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/.test(password) === false){
                    userinput.style.color = "red"
                }
                else {
                    userinput.style.color = "green" ;
                }
        });
    };
    ValidateUser();
    ValidatePass();  
};

