/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function initGui() {
	var height = 375;
    var width = 160;
    var clickFlag = false;
    
    var ubwidget = $("#ubwidget").ubwidget({
        width:width,
        height:height,
    });
		
    var historyTab = $("<div></div>")
    .css({
        height:height,
        marginRight:0,
        width:20,
        float:"left",
        backgroundImage:"url(images/historytab.png)",
        backgroundRepeat:"no-repeat"
    })
    .toggle(
        function(){
            resizeWidget(370);
            historyPanel.show();
            $(".ubw-container").css({
                backgroundImage:"url(images/back.png)",
                width:328
            });
            if(window.sankore){
                window.sankore.setPreference('historyTab', "visible");
            };
        },
        function(){
            resizeWidget(200);
            historyPanel.hide();
            $(".ubw-container").css({
                backgroundImage:"url(images/back_small.png)",
                width:160
            });
            if(window.sankore){
                window.sankore.setPreference('historyTab', "hidden");
            };
        }
        )
    .hover(
        function(){
            $(this).css({
                backgroundImage:"url(images/historytabOver.png)"
            });
        },
        function(){
            $(this).css({
                backgroundImage:"url(images/historytab.png)"
            });
        }
        )
    .appendTo($("body"));
	
    var keysPanel = $("<div id='keysPanel'></div>").css({
        float:"left"
    });

	var screen = $("<div id='screen'></div>")
	.css({
		padding:"4px 12px 0px 12px",
        marginLeft:"2px",
        marginBottom:"5px",
        marginTop:"7px",
        backgroundImage:"url(images/display.png)",
        fontSize:"22px",
        fontFamily:"Arial, Helvetica, Sans-serif",
        color:"#777788",
        width:"118px",
        height:"60px",
        overflow:"hidden",
        textAlign:"right",
	});
	
	var displayFormula = $("<p id='displayFormula'>0</p>")
    .css({
        height : "24px",
    });
	
	var memoryActive = $("<p id='memoryActive'></p>")
	.css({
		height : "12px",
		fontSize: "12px",
	});
	
	var displayResult = $("<p id='displayResult'>0</p>")
    .css({
       height : "24px",
    });
	
	screen.append(displayFormula);
	screen.append(memoryActive);
	screen.append(displayResult);
		
    var standardPanel = $("<div></div>").css({
        float:"left"
    });
	
    var cKeySize = {
        w:33, 
        h:36
    };
	
	/* Buttons declaration and creations */
	
	var btnMR = $("<div><img src='images/toucheMR.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
	.mousedown(function(){
        memoryRead();
    });
	
	
	var btnMC = $("<div><img src='images/toucheMC.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
	.mousedown(function(){
        memoryReset();
    });
	
	var btnMMoins = $("<div><img src='images/toucheM-.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
	.mousedown(function(){
        memorySub();
    });
	
	var btnMPlus = $("<div><img src='images/toucheM+.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
	.mousedown(function(){
        memoryAdd();
    });
	
	var btnOP = $("<div><img src='images/toucheOP.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
	.mousedown(function(){
        if( hiddenOP == "" ) {
			defineOperator();
		} else {
			useOperator();
		}
    });
	
	var btnDivisionEuclidienne = $("<div><img src='images/toucheDivisionEuclidienne.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
	.mousedown(function(){
        appendToWriteLine("%","├");
    });
	
	var btnPaL = $("<div><img src='images/touchepg.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("(","(");
    });
	
    var btnPaR = $("<div><img src='images/touchepd.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine(")",")");
    });
	
    var btn7 = $("<div><img src='images/touche7.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("7","7");
    });
	
    var btn8 = $("<div><img src='images/touche8.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("8","8");
    });
	
    var btn9 = $("<div><img src='images/touche9.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("9","9");
    });
	
    var btnDiv = $("<div><img src='images/touchediv.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("/","÷");
    });
	
    var btn4 = $("<div><img src='images/touche4.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("4","4");
    });
	
    var btn5 = $("<div><img src='images/touche5.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("5","5");
    });
	
    var btn6 = $("<div><img src='images/touche6.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("6","6");
    });
	
    var btnMul = $("<div><img src='images/touchef.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("*","x");
    });
	
    var btn1 = $("<div><img src='images/touche1.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("1","1");
    });
	
    var btn2 = $("<div><img src='images/touche2.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("2","2");
    });
	
    var btn3 = $("<div><img src='images/touche3.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("3","3");
    });
	
    var btnSou = $("<div><img src='images/touchem.png'/></div>").ubwbutton({
        w:68, 
        h:34
    })
    .mousedown(function(){
        appendToWriteLine("-","-");
    });
	
    var btn0 = $("<div><img src='images/touche0.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine("0","0");
    });
	
    var btnDot = $("<div><img src='images/touchedot.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        appendToWriteLine(".",".");
    });
	
    var btnC = $("<div><img src='images/touchec.png'/></div>").ubwbutton({
        w:cKeySize.w, 
        h:cKeySize.h
    })
    .mousedown(function(){
        reset();
    });
	
    var btnAdd = $("<div><img src='images/touchep.png'/></div>").ubwbutton({
        w:68, 
        h:34
    })
    .mousedown(function(){
        appendToWriteLine("+","+");
    });
	
    var btnEqu = $("<div><img src='images/toucheeq.png'/></div>").ubwbutton({
        w:cKeySize.w,
        h:cKeySize.h
    })
    .mousedown(function(){
        calculateResult();
    });		
	
    var historyPanel = $("<div id='historyPanel'></div>")
    .css({
        backgroundImage:"url(images/historyback.png)",
        width:"auto",
        height:"auto",
        float:"left",
        marginLeft:3,
        marginRight:2,
        marginTop:6
    })
    .hide();

    var historyBox = $("<textarea id='historyBox'></textarea>")
    .css({
        padding:10,
        fontSize:"20px",
        fontFamily:"Arial, Helvetica, Sans-serif",
        width:143,
        height:316,
        backgroundColor:"transparent",
        resize:"none",
        border:"none",
        overlay:"none",
        color:"#eeeeee"
    })
    .val("0");
		
    historyPanel.append(historyBox);
	
    var stop = $("<div></div>");
    var sleft = $("<div></div>");
    var sright = $("<div></div>");
	
    stop.css({
        width:140
    })
	.append(btnMR).append(btnMC).append(btnMMoins).append(btnMPlus)
	.append(btnOP).append(btnPaL).append(btnPaR).append(btnDivisionEuclidienne)
    .append(btnAdd).append(btnSou)
    .append(btn7).append(btn8).append(btn9).append(btnMul)
    .append(btn4).append(btn5).append(btn6).append(btnDiv);
		
    sleft.css({
        width:105, 
        float:"left"
    })
    .append(btn1).append(btn2).append(btn3)
    .append(btn0).append(btnDot).append(btnC);
		
    sright.css({
        width:45, 
        float:"left"
    })
    .append(btnEqu);
	
	
    standardPanel.css({
        width:150
    })
    .append(stop)
    .append(sleft).append(sright);
	
    keysPanel
    .append(screen)
    .append(standardPanel);
	
    ubwidget
    .append(historyPanel)
    .append(keysPanel);
	
    if(window.sankore){
        historyTxt = window.sankore.preference('historyTxt', historyTxt);
        var ht = window.sankore.preference('historyTab', "hidden");
        $("#historyBox").val(historyTxt);
        if(ht === "visible"){
            historyTab.trigger("click");
        };
    }
	
    function resizeWidget(w){
        window.sankore.resize(w, 380);
    }
	
	$("#historyBox").click(function(){
        if(!clickFlag){
            $(this).select();
            clickFlag = true;
        }
        else{
            clickFlag = false;
            $(this).blur();
        }
    });
    $(document).disableTextSelect();
}