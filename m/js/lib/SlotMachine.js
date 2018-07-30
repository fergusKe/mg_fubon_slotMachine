// JavaScript Document
function SlotMachine(element, pOption){
    var _options = {
            barArr:[],
            moveBol:false,
            completeNum:0,
            callback:false
        },
        _gameObj = {
            barAnsArr:[],
            rigtAnsArr:[],
            wrongAnsArr:[]
        },
        _this = this;
    
    init();
    //private
    function init(){
        _options = $.extend(_options, pOption);
        /*element.children().each(function(i){
            _options.barArr.push(new SlotMachineBar($(this), {callback:slotMachineComplete}));
        });*/
        element.each(function(i){
            _options.barArr.push(new SlotMachineBar($(this), {callback:slotMachineComplete, index:i}));
        });
        setGame();
        TweenMax.ticker.fps(30);
        TweenMax.ticker.addEventListener("tick", update);
    };

    function setGame(){
        _gameObj.rigtAnsArr = ['111', '222', '333', '123', '321'];
        for(var firstNum = 1; firstNum <= 3; firstNum++){
            var firstStr = firstNum.toString();
            for(var secondNum = 1; secondNum <= 3; secondNum++){
                var secondStr = firstStr + secondNum;
                for(var thirdNum = 1; thirdNum <= 3; thirdNum++){
                    var thirdStr = secondStr + thirdNum;
                    if(_gameObj.rigtAnsArr.indexOf(thirdStr) == -1){
                        _gameObj.wrongAnsArr.push(thirdStr);
                    }
                }
            }
        }
    }
    
    function update(){
        changeBar("update");
    }
    
    function changeBar(pType){
        for(var upNum = 0; upNum < _options.barArr.length; upNum++){
            switch(pType){
                case "update":
                    _options.barArr[upNum].update();
                break;
                case "startAction":
                    _options.barArr[upNum].startAction();
                break;
                case "stopAction":
                    _options.barArr[upNum].stopAction(_gameObj.barAnsArr[upNum]);
                break;
            }
            _options.barArr[upNum].update();
        }
    }
    
    function slotMachineComplete(){
        _options.completeNum++;
        if(_options.completeNum >= _options.barArr.length){
            _options.moveBol = false;
            if(isFun(_options.callback)){
                _options.callback();
            }
            //_options.callback();
            console.log("moveEnd");
        }
    }
    
    function isFun(pObj){
        return (pObj && typeof pObj === "function")
    };
    
    //public
    this.startAction = function(){
        if(!_options.moveBol){
            _options.moveBol = true;
            _options.completeNum = 0;
            changeBar("startAction");
        }
        
    };
    
    this.stopAction = function(pNum){
        console.log(pNum);
        delete _gameObj.barAnsArr;
        if(pNum <= 0){
            _gameObj.barAnsArr = _gameObj.wrongAnsArr[parseInt(Math.random() * _gameObj.wrongAnsArr.length)];
        }else{
            _gameObj.barAnsArr = _gameObj.rigtAnsArr[pNum - 1];
        }
        _gameObj.barAnsArr = _gameObj.barAnsArr.split("");
        //console.log(_gameObj.barAnsArr);
        changeBar("stopAction");
    }
    
    //other class
    function SlotMachineBar(element, pOptions){
        var _options = {
                moveType: "",
                maxSpeed: 32,
                nowSpeed: 1,
                delaySpeed: 0,
                totalMove: 0,
                minMoveY: 0,
                maxMoveY: 0,
                moveTimerNum: 3,
                callback: false,
                disH: 145,
                nowEle: false
            },
            _this = this;

        init();
        //private
        function init(){
            var rndStr, rndArr = [];
            _options = $.extend(_options, pOptions);
            _options.list = element.children();
            _options.list.css('position', 'absolute');
            _options.minY = -parseInt(_options.list.length/2) * _options.disH;
            _options.maxY = _options.minY + _options.disH * _options.list.length;
            //var rndStr = parseInt(Math.random() * _options.list.length);
            for(var setNum = 0; setNum < _options.list.length; setNum++){
                rndArr.push(setNum);
            }
            _options.list.each(function(i){
                //var topNum = _options.minY + _options.disH * (i + rndStr);
                var topNum = parseInt(Math.random() * rndArr.length);
                topNum = rndArr.splice(topNum, 1);
                topNum = _options.minY + _options.disH * (topNum);
                $.data(this, {top:0});
                setPosition($(this), topNum);
            });

        };

        function setPosition(pEle, pNum){
            var obj = $.data(pEle[0]);
            obj.top += pNum;
            if(obj.top < _options.minY){
               obj.top = obj.top - _options.minY + _options.maxY;
            }else if(obj.top > _options.maxY){
                obj.top = obj.top - _options.maxY + _options.minY;
            };

            $.data(pEle[0], obj);
            var cssObj = $.extend({}, obj);
            cssObj.top += "px";
            cssObj.left += "px";
            pEle.css(cssObj);

        };

        //public
        this.update = function(){
            if(_options.moveType != ""){
                _options.list.each(function(i){
                    setPosition($(this), _options.nowSpeed);
                });

                if(_options.moveType == "start"){
                    if(_options.nowSpeed < _options.maxSpeed){

                        if(_options.delaySpeed == 0){
                            _options.delaySpeed = 15;
                            _options.nowSpeed+=_options.nowSpeed;

                        }else{
                            _options.delaySpeed--;
                        };
                        _options.totalMove += _options.nowSpeed;

                    };
                }else if(_options.moveType == "moveEnd"){
                    var checkObj = $.data(_options.nowEle[0]);
                    var disNum = checkObj.top;
                    if(disNum > 0){
                        disNum = _options.minY - (_options.maxY - disNum);
                    };
                    disNum = Math.abs(disNum);
                    if(disNum >= _options.totalMove && disNum <= _options.totalMove + _options.nowSpeed){
                        _options.delaySpeed = 0;
                        _options.moveType = "stop";
                    };
                }else if(_options.moveType == "stop"){

                    if(_options.nowSpeed > 1){
                        if(_options.delaySpeed == 0){
                            _options.delaySpeed = 15;
                            _options.nowSpeed -= _options.nowSpeed/2;
                        }else{
                            _options.delaySpeed--;
                        }
                    };

                    var checkObj = $.data(_options.nowEle[0]);
                    if(checkObj.top == 0){
                        _options.moveType = "";
                        if(isFun(_options.callback)){
                            _options.callback();
                        }
                    };
                };

            };
        };

        this.startAction = function(){
            TweenMax.delayedCall(Math.random()*0.5,function(){
                _options.delaySpeed = 0;
                _options.totalMove = 0;
                _options.moveType = "start";
                
            });

        };
        
        this.stopAction = function(pNum){
            var eleName = '.gift' + pNum;
            if(_options.nowEle){
                _options.nowEle = null;
            };
            //_options.nowEle = _options.list.eq(pNum);
            _options.nowEle = _options.list.siblings(eleName);
            console.log(_options.nowEle.length);
            _options.nowEle = _options.nowEle.eq(parseInt(Math.random() * _options.nowEle.length))
            /*TweenMax.delayedCall(_options.moveTimerNum + Math.random(), function(){
                _options.moveType = "moveEnd";
            });*/
            TweenMax.delayedCall(_options.moveTimerNum + _options.index * 1, function(){
                _options.moveType = "moveEnd";
            });
        }
        
    }
}


