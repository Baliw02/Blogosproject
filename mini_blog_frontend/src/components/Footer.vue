<template>
    <div class="full-footer">
        <div class="wrapper">
            <ul>
                <li>
                    <h1>Lorem Ipsum</h1>
                    <p>lamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute </p>
                </li>
                <li>
                    <h1>Lorem Ipsum</h1>
                    <p>lamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute asdasdasdasdas dasdasdasd asd asdasd </p>
                </li>
                <li>
                    <h1>Lorem Ipsum</h1>
                    <p>lamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute </p>
                </li>
                <li>
                    <h1>Lorem Ipsum</h1>
                    <p>lamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute </p>
                </li>
            </ul>
            <ul class="footer-bottom">
                <li class="left">Copyright &copy;</li>
                <li>Made by Erdsoft</li>
                <li class="right">Random</li>
            </ul>
        </div>
    </div>  
</template>

<script>
export default {

}
</script>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
$primary-font: Quicksand;

.full-footer{
    margin-top:1%;
    width:100%;
    bottom:0;
    background-color:black;
    display:flex;
    justify-content: center;
    .wrapper{
        color: azure;
        max-width:1200px;
        ul{    
            padding-left: 0;
            text-align: left;
            display:flex;
            justify-content: center;
            list-style: none;
            width:100%;
            @media only screen and (max-width:1200px){
                flex-wrap: wrap;
            }
            li{
                padding:15px 15px;
                flex:25%;
                font-family: $primary-font;
            @media only screen and (max-width:1200px){
                padding:5px 5px;
                flex:40%;
            }
                h1{
                    font-weight: 400;
                    font-size:24px;
                    border-bottom: 1px solid rgba(128, 128, 128, 0.473);
                }
                p{
                    color:rgb(216, 231, 231);
                    font-weight: 400;
                    font-size:16px;
                }
            }
        }
        .footer-bottom{
            font-weight: 100;
            color:azure;
            text-align: center;
            flex-wrap: nowrap;
            li{
                flex:30%;
            }
            .left{
                flex:30%;
                text-align: left;
            }
            .right{
                flex:30%;
                text-align: right;
            }
        }
    }  
}
</style>