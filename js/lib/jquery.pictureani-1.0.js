// JavaScript Document
/*
    type為img時 參數frameWidth，frameHeight,totalFrames不用設定
 */
(function(){
    function PictureAni(element, settings){
        var defaultSetting = {
            fps             :30
            ,loop           :false
            ,frameWidth     :100
            ,frameHeight    :100
            ,totalFrames    :false//必要(type="bg")
            ,complete       :false
            ,loopDelay      :false//延遲輪播
            ,autoBack       :false//自動回播
            ,width          :false
            ,type           :"bg"//bg 連續圖檔; img 單一圖片
        },
        _settings = $.extend(defaultSetting, settings);
        
        var _currFrame = 0,
            _animateTimer = null,
            _timerNum = Math.floor(1000/_settings.fps),
            _moveBol = true,
            _loopTimer = null,
            _rowAniNum = false,
            _aniBol = false;

        if(_settings.type != "img"){
            element.width(_settings.frameWidth);
            element.height(_settings.frameHeight);
            element.css('background-position', '0 0');
        }else{
            _settings.childrens = element.find('img').clone();
            _settings.totalFrames = _settings.childrens.length;
            element.html("");
        }
        
        
        if(_settings.width){
            _rowAniNum = parseInt(_settings.width / _settings.frameWidth);
        };
        
        function _animate(){
            _aniBol = true;
            //console.log("_currFrame=",_currFrame);
            if(_moveBol){
                if(_currFrame < _settings.totalFrames){
                    checkAmiType();
                    //setBackgroundPosition();
                    _currFrame++;
                }else{
                    moveComplete();
                }
            }else{
                if(_currFrame >= 0){
                    checkAmiType();
                    //setBackgroundPosition();
                    _currFrame--;
                }else{
                    moveComplete();
                }
            }
            
            if(_aniBol){
                startTimer();
            }
            
        };
        
        function checkAmiType(){
            if(_settings.type != "img"){
                setBackgroundPosition();
            }else{
                var img = _settings.childrens.eq(_currFrame).clone();
                element.append(img);
                if(element.find('img').length > 1){
                    window.setTimeout(function(){
                        element.find('img:eq(0)').remove();
                    },10);
                }
            }
        }

        function setBackgroundPosition(){
            var bgPos = element.css('background-position');
            var posObj = {x:0, y:0};
            var ie = true;
            
            if(bgPos == 'undefined' || bgPos == null){
                bgPos = parseInt(element.css('background-position-y'));
            } else {
                   bgPos = bgPos.split(' ');
                   bgPos = parseInt(bgPos[1]);
                   ie = false;
            }
            
            posObj.y = -(_settings.frameHeight) * _currFrame;
            if(_rowAniNum){
                posObj.x = (_settings.frameWidth) * (_currFrame % _rowAniNum);
                posObj.y = _settings.frameHeight * parseInt(_currFrame / _rowAniNum);
                posObj.x *= -1; 
                posObj.y *= -1; 
            }
            
            if(ie){ 
                element.css('background-position-x', posObj.x + 'px'); 
                element.css('background-position-y', posObj.y + 'px'); 
            }else { 
                element.css('background-position', (posObj.x + 'px ' + posObj.y + 'px')); 
                
            }
            //console.log(posObj.x);
        };
        
        function returnComplete(){
            _aniBol = false;
            if(_settings.complete && typeof _settings.complete === "function"){_settings.complete();};
        };
        
        function startTimer(){
            closeTimer();
            _animateTimer = setTimeout(_animate, _timerNum);
        };
        
        function closeTimer(){
            if(_animateTimer){
                clearTimeout(_animateTimer);
            }
        };
        
        function moveComplete(){
            if(_settings.loop){
                if(!_settings.loopDelay){
                    moveLoop();
                }else if(!_loopTimer){
                    _loopTimer = window.setTimeout(moveLoop, _settings.loopDelay*1000);
                    
                }
                
            }else{
                returnComplete();
            }
        };
        
        function moveLoop(){
            if(!_settings.autoBack){
                if(_moveBol){
                    _currFrame = 0;
                }else{
                    _currFrame = _settings.totalFrames - 1;
                }
            }else{
                _moveBol = !_moveBol;
            }
            
            window.clearTimeout(_loopTimer);
            _loopTimer = null;
        };
        
        this.play = function(){
            _moveBol = true;
            if(_currFrame <= 0 || _currFrame >= (_settings.totalFrames - 1)){
                _currFrame = 0;
            }
            _animate();
        };
        
        this.back = function(){
            _moveBol = false;
            if(_currFrame <= 0 || _currFrame >=(_settings.totalFrames - 1)){
                _currFrame = (_settings.totalFrames - 1);
            }
            _animate();
        };
        
        this.pause = function(){
            closeTimer();
        };
        
        if(_settings.loop){
            startTimer();
        }
    };
    
    $.fn.pictureani = function(options){
        
        return this.each(function(){
            $( this ).data('pictureani', new PictureAni( $( this ), options ) ); 
        });
        
    };
    
    $.fn.pictureani_play = function(){
        return $( this ).data( 'pictureani' ).play();
    };
    
    $.fn.pictureani_back = function(){
        return $( this ).data( 'pictureani' ).back();
    };
    
    $.fn.pictureani_pause = function(){
        return $( this ).data( 'pictureani' ).pause();
    };
    
})(jQuery)