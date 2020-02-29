var counter = 0;
$(window).on('resize', function(e) {
  	counter++;
 	setTimeout(() =>
 	{
 		if(--counter == 0)
 		{
 			resizeBackground();
 			if(drawingBoard)
 			{
 				drawingBoard.sizeUpdate();
 			}
 			else
 			{
 				initDrawingBoard();
 			}
 		}
 	}, 100)
});

var drawingBoard;

$(function() {
	
	initDrawingBoardSize();
	resizeBackground();
	initDrawingBoard();
	
	$("#drawing_control .choose_drawing_color_btn").css("background-color", drawingBoard.getLineColor);
	
	$(".save_btn").bind("click", function() {
		console.log("save lineList");
		console.log("lineList = ", drawingBoard.getLineList());
		console.log("lineListJson = ", JSON.stringify(drawingBoard.getLineList()));
		let lineListJson = JSON.stringify(drawingBoard.getLineList());
		localStorage.setItem('lineListJson', lineListJson);
	});
	
	$(".reload_btn").bind("click", function() {
		let lineListJson = localStorage.getItem('lineListJson');
		let _lineList = JSON.parse(lineListJson);
		drawingBoard.setLineList(_lineList);
		console.log("load lineList");
		console.log("lineListJson = ", lineListJson);
		console.log("lineList = ", _lineList);
		drawingBoard.sizeUpdate();
	});
	
	$(".set_size_btn").bind("click", function() {
		$(".popup").removeClass("hide");
	});
	
	$(".submit_btn").bind("click", function() {
		initWidth = $("#init_width").val();
		initHeight = $("#init_height").val();
		ratio = initWidth / initHeight;
		$("#edit_part").css("width", initWidth);
		$("#edit_part").css("height", initHeight);
		resizeBackground();
		initDrawingBoard();
		$(".popup").addClass("hide");
	});
	
	$(".cancel_btn").bind("click", function() {
		$(".popup").addClass("hide");
	});
	
});



function initDrawingBoard() {
	if(drawingBoard != null) {
		drawingBoard.sizeUpdate();
		return;
	}

	var drawingBoardCanvas = $("#drawing_board").get(0);
	drawingBoard = new DrawingBoard(drawingBoardCanvas);
	drawingBoard.sizeUpdate();

	$("#drawing_control .choose_drawing_color_btn").unbind("click").spectrum({
		color: "rgba(0, 0, 0, 1)",
		showAlpha: true,
		showPalette: true,
		clickoutFiresChange: false,
		palette: [
			['black', 'white', 'blanchedalmond'],
			['orange', 'red', 'yellow'],
			['green', 'blue', 'pink']
		],
		maxSelectionSize: 3,
		change: function (color) {
			var rgbColor = color.toRgbString();
			changeDrawingColor(rgbColor);
		}
	}).bind("click", function() {
		var eraserBtn = $("#drawing_control .eraser_drawing_btn");
		if(eraserBtn.hasClass("on")) {
			eraserBtn.trigger("click");
			$(this).trigger("click");
		}
	});

	$("#drawing_control .eraser_drawing_btn").unbind("click").bind("click", function() {
		drawingBoard.usePencil();
		drawingBoard.setEraserFlag(true);
		let _eraserLineSize = 10;
		drawingBoard.setLineSize(_eraserLineSize);
	});

	$("#drawing_control .clear_all_drawing_btn").unbind("click").bind("click", function() {
		drawingBoard.clearDraw();
	});
	
	$("#drawing_control .undo_btn").unbind("click").bind("click", function() {
		drawingBoard.undo();
	});
	$("#drawing_control .redo_btn").unbind("click").bind("click", function() {
		drawingBoard.redo();
	});
	$("#drawing_control .choose_pencil_btn").unbind("click").bind("click", function() {
		drawingBoard.usePencil();
		if(drawingBoard.getOpenDropdown())
		{
			let parent = $(this).parent();
			$(parent).children().addClass("dropdown_content");
	 		$(this).removeClass("dropdown_content");
	 		$(this).prependTo(parent);
	 		drawingBoard.setOpenDropdown(false);
	 		return false;
		}
	});
	$("#drawing_control .choose_line_btn").unbind("click").bind("click", function() {
		drawingBoard.useLine();
		if(drawingBoard.getOpenDropdown())
		{
			let parent = $(this).parent();
			$(parent).children().addClass("dropdown_content");
	 		$(this).removeClass("dropdown_content");
	 		$(this).prependTo(parent);
	 		drawingBoard.setOpenDropdown(false);
	 		return false;
		}
	});
	$("#drawing_control .choose_rect_btn").unbind("click").bind("click", function() {
		drawingBoard.useRectangle();
		if(drawingBoard.getOpenDropdown())
		{
			let parent = $(this).parent();
			$(parent).children().addClass("dropdown_content");
	 		$(this).removeClass("dropdown_content");
	 		$(this).prependTo(parent);
	 		drawingBoard.setOpenDropdown(false);
	 		return false;
		}
	});
	$("#drawing_control .choose_circle_btn").unbind("click").bind("click", function() {
		drawingBoard.useCircle();
		if(drawingBoard.getOpenDropdown())
		{
			let parent = $(this).parent();
			$(parent).children().addClass("dropdown_content");
	 		$(this).removeClass("dropdown_content");
	 		$(this).prependTo(parent);
	 		drawingBoard.setOpenDropdown(false);
	 		return false;
		}
	});
	$("#drawing_control .choose_text_btn").unbind("click").bind("click", function(event) {
		drawingBoard.useText();
		if(drawingBoard.getOpenDropdown())
		{
			let parent = $(this).parent();
			$(parent).children().addClass("dropdown_content");
	 		$(this).removeClass("dropdown_content");
	 		$(this).prependTo(parent);
	 		drawingBoard.setOpenDropdown(false);
	 		return false;
		}
	});
	$("#drawing_control .choose_cursor_btn").unbind("click").bind("click", function() {
		drawingBoard.useCursor();
		if(drawingBoard.getOpenDropdown())
		{
			let parent = $(this).parent();
			$(parent).children().addClass("dropdown_content");
	 		$(this).removeClass("dropdown_content");
	 		$(this).prependTo(parent);
	 		drawingBoard.setOpenDropdown(false);
	 		return false;
		}
	});
	
	$("#drawing_control .dropdown").unbind("click").bind("click", function(event) {
		if(!drawingBoard.getOpenDropdown())
		{
			$(this).children().removeClass("dropdown_content");
			drawingBoard.setOpenDropdown(true);
		}
	});
	
	
}

var ratio;
var initWidth;
var initHeight;

function initDrawingBoardSize()
{
	ratio = (window.innerWidth -22) / (window.innerHeight - 22);
	initWidth = getCanvasWidth();
	initHeight = getCanvasHeight();
	$("#edit_part").css("width", initWidth);
	$("#edit_part").css("height", initHeight);
}

function getCanvasWidth()
{
	return 	window.innerWidth - 22;
}

function getCanvasHeight()
{
	return 	window.innerHeight - 22;
}

function resizeBackground()
{
	console.log('resizeBackground');
	let currentHeight = getCanvasHeight();
	let currentWidth = getCanvasWidth();
	
	if(ratio < 1)
 	{
		console.log('ratio < 1');
		
		if(currentWidth < initWidth && currentHeight >= initHeight)
		{
			console.log('currentWidth < initWidth && currentHeight >= initHeight');
			let width = currentWidth;
 			let height = width / ratio;
		
 			$("#edit_part").css("width", width);
 			$("#edit_part").css("height", height);
		}
		else if(currentWidth < initWidth && currentHeight < initHeight)
		{
			console.log('currentWidth < initWidth && currentHeight < initHeight');
			let currentRatio = currentWidth / currentHeight;
			if(currentRatio > ratio)
			{
				let height = getCanvasHeight();
				let width = height * ratio;
				
	 			$("#edit_part").css("width", width);
	 			$("#edit_part").css("height", height);
			}
			else
			{
				let width = currentWidth;
				let height = width / ratio;
			
	 			$("#edit_part").css("width", width);
	 			$("#edit_part").css("height", height);
			}
			
		}
		else if(currentWidth >= initWidth && currentHeight == initHeight)
		{
			console.log('currentWidth >= initWidth && currentHeight == initHeight');
			$("#edit_part").css("width", initWidth);
 			$("#edit_part").css("height", initHeight);
		}
		else if(currentWidth >= initWidth && currentHeight >= initHeight)
		{
			console.log('currentWidth >= initWidth && currentHeight >= initHeight');
			let height = getCanvasHeight();
 			let width = height * ratio;
		
 			$("#edit_part").css("width", width);
 			$("#edit_part").css("height", height);
		}
		else if(currentWidth >= initWidth && currentHeight < initHeight)
		{
			console.log('currentWidth >= initWidth && currentHeight < initHeight');
			let height = getCanvasHeight();
 			let width = height * ratio;
		
 			$("#edit_part").css("width", width);
 			$("#edit_part").css("height", height);
		}
		else
		{
			console.log("other");
		}
		
	}
	else if(ratio >= 1)
	{
		console.log('ratio >= 1');
		
		if(currentWidth < initWidth && currentHeight >= initHeight)
		{
			console.log('currentWidth < initWidth && currentHeight >= initHeight');
			let width = currentWidth;
			let height = width / ratio;
			
			$("#edit_part").css("width", width);
			$("#edit_part").css("height", height);
		}
		else if(currentWidth < initWidth && currentHeight < initHeight)
		{
			console.log('currentWidth < initWidth && currentHeight < initHeight');
			let currentRatio = currentWidth / currentHeight;
			if(currentRatio > ratio)
			{
				let height = getCanvasHeight();
				let width = height * ratio;
				
	 			$("#edit_part").css("width", width);
	 			$("#edit_part").css("height", height);
			}
			else
			{
				let width = currentWidth;
				let height = width / ratio;
			
	 			$("#edit_part").css("width", width);
	 			$("#edit_part").css("height", height);
			}
			
		}
		else if(currentWidth >= initWidth && currentHeight == initHeight)
		{
			console.log('currentWidth >= initWidth && currentHeight == initHeight');
			$("#edit_part").css("width", initWidth);
 			$("#edit_part").css("height", initHeight);
		}
		else if(currentWidth >= initWidth && currentHeight >= initHeight)
		{
			console.log('currentWidth >= initWidth && currentHeight >= initHeight');
			let width = currentWidth;
			let height = width / ratio;
		
 			$("#edit_part").css("width", width);
 			$("#edit_part").css("height", height);
		}
		else if(currentWidth >= initWidth && currentHeight < initHeight)
		{
			console.log('currentWidth >= initWidth && currentHeight < initHeight');
			let height = getCanvasHeight();
 			let width = height * ratio;
		
 			$("#edit_part").css("width", width);
 			$("#edit_part").css("height", height);
		}
		else
		{
			console.log('other');
		}
	}
	
}

function changeDrawingColor(color) {
	
	drawingBoard.setLineColor(color);
	$(".choose_drawing_color_btn").css("background-color", color);
	
	$(".drawing_discussion_part .answer_input .drawing_control .choose_drawing_color_btn")
		.css("background-color", color)
		.spectrum("set", color);
}


function DrawingBoard(canvas) {
	var context;

	var isDrawing = false;
	var lineSize = 2;
	
	var lineOpacity = 1.0;

	var eraserFlag = false;
	var currLine;

	var touchFlag;
	
	var lineList = [];
	var deletedLineList = [];
	
	var lineColor = "#000000";
	
	var firstPoint = null;
	var endPoint = null;
	
	var drawingMode = 'PENCIL';
	var isTexting = false;

	var openDropdown = false;

	function init() {
		context = canvas.getContext("2d");
		
		$(canvas)
			.bind("mousedown touchstart", handleStartDrawing)
			.bind("mousemove touchmove", handleDrawing)
			.bind("mouseup touchend", handleEndDrawing);
	}

	function handleStartDrawing(event) {
		event = event.originalEvent;

		if(isDrawing) {
			return;
		}
		isDrawing = true;
		event.preventDefault();

		var point = getDrawingPoint(event);
		let id = "line"+ new Date().getTime();

		if(drawingMode == "TEXT")
		{
			isDrawing = false;
			if(!isTexting)
			{
				let inputWrapper = $("<div>").attr("id", id).addClass("input-wrapper");
				if(event.offsetX == void 0)
				{
					event.offsetX = event.touches[0].pageX - event.touches[0].target.offsetLeft;     
				}
				if(event.offsetY == void 0)
				{
					event.offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop;
				}
				let input = $("<input>")
								.attr("type", "text")
								.attr("class", "input-text")
								.css("position", 'absolute')
								.css("top", event.offsetY+'px')
								.css("left", event.offsetX+'px')
								.css("font-size", '20px')
								.css("width", '50px');
				let span = $("<span>")
								.attr("class", "input-span")
								.css("font-size", '20px')
								.css("position", 'absolute')
								.css("z-index", "1000")
								.css("left", "-500px");
				
				$(inputWrapper).append(input).append(span);
				$(document.body).append(inputWrapper);
				isTexting = true;
				input.focus();
				let borderWidth = ($(input).outerWidth() - $(input).innerWidth())*2;
				$(input).bind('input', function() {
					$(span).html($(this).val());
					if($(span).outerWidth() > '50')
					{
						 $(this).innerWidth($(span).outerWidth() + borderWidth + "px");
					}
				});
				
				$(input).blur(inputBlurEvent);
			}
			else
			{
				$(".input-text").blur();
			}
		}
		else if(drawingMode == "CURSOR")
		{
			isDrawing = false;
			$(".input-wrapper").css("visibility", "visible");
			if(isTexting)
			{
				$(".input-text").blur();
			}
			else
			{
				$(".input-wrapper").click(function() {
					$(this).css("opacity", "1");
					let input = $(this).find("input");
					$(input).unbind("blur").blur(inputBlurEvent);
					isTexting = true;
				});
			}
		}
		else
		{
			currLine = {
				width: $("#drawing_board").width(),
				height: $("#drawing_board").height(),
				color: lineColor,
				size: lineSize,
				eraserFlag: eraserFlag,
				opacity: eraserFlag ? 1 : lineOpacity,
				points: [],
				drawingMode: drawingMode,
				id:null
			};
			
			currLine.points.push(point);
			currLine.id = id;
			drawLine(point, point);
		}

		touchFlag = event.type.indexOf("touch") >= 0;
		
		firstPoint = point;
	}

	function handleDrawing(event) {
		
		event = event.originalEvent;

		if(!isDrawing) {
			return;
		}

		if (touchFlag && event.which != 0) {
			return
		} else if (!touchFlag && event.which != 1) {
			return
		}

		event.preventDefault();

		if(drawingMode == "LINE")
		{
			var point = getDrawingPoint(event);
			restoreDrawingResize(lineList);
			endPoint = point;
			currLine.drawingMode = drawingMode;
			currLine.points = [];
			currLine.points.push(firstPoint);
			currLine.points.push(endPoint);
			drawLine(firstPoint, endPoint);
		}
		else if(drawingMode == "RECTANGLE")
		{
			var point = getDrawingPoint(event);
			restoreDrawingResize(lineList);
			endPoint = point;
			currLine.drawingMode = drawingMode;
			currLine.points = [];
			currLine.points.push(firstPoint);
			currLine.points.push(endPoint);
			drawRect(firstPoint, endPoint);
		}
		else if(drawingMode == "CIRCLE")
		{
			var point = getDrawingPoint(event);
			restoreDrawingResize(lineList);
			endPoint = point;
			currLine.drawingMode = drawingMode;
			currLine.points = [];
			currLine.points.push(firstPoint);
			currLine.points.push(endPoint);
			drawCircle(firstPoint, endPoint);
		}
		else //drawingMode == "PENCIL" 
		{
			var prevPoint = currLine.points[currLine.points.length - 1];
			var point = getDrawingPoint(event);
			currLine.drawingMode = drawingMode;
			currLine.points.push(point);
			drawLine(prevPoint, point);
		}
		
	}

	function handleEndDrawing(event) {
		event = event.originalEvent;

		if(!isDrawing) {
			
			return;
		}
		isDrawing = false;

		event.preventDefault();
		
		for(let i = 0; i < 2;i++)
		{
			if(currLine.points.length > 100)
			{
				let temp = [];
				currLine.points.forEach(function(point, index){
					if(index%2 ==0){
						temp.push(point)
					}
				});
				currLine.points = temp;
			}
		}	
		lineList.push(currLine);
		let tempLineList = lineList;
		currLine = null;
		clearDraw();
		lineList = tempLineList;
		tempLineList = [];
		deletedLineList = [];
		sizeUpdate();
		firstPoint = null;
		endPoint = null;
	}

	function inputBlurEvent()
	{
		currLine = {
			width: $("#drawing_board").width(),
			height: $("#drawing_board").height(),
			color: lineColor,
			size: lineSize,
			eraserFlag: eraserFlag,
			opacity: eraserFlag ? 1 : lineOpacity,
			points: [],
			drawingMode: drawingMode,
			text: "",
			fontSize: '20px Arial',
			id: null,
			top: null,
			left: null,
		};
		
		let input = $(this);
		let inputWrapper = $(this).closest(".input-wrapper")
		let text = $(input).val();
		if(text.trim().length == 0)
		{
			inputWrapper.remove();
		}
		let lineId = $($(this).closest(".input-wrapper")).attr('id');
		console.log('lineListlenght = ', lineList.length);
		
		for(let i=0; i<lineList.length; i++)
		{
			if(lineList[i].id == lineId)
			{
				console.log("line = ", lineList[i])
				console.log("lineId = ", lineId)
				console.log("delete :" + lineList[i].id);
				lineList.splice(i, 1);
				console.log(lineList.length);
				sizeUpdate();
			}
		}
		
		
		
		let rect = input[0].getBoundingClientRect();
		let x = Math.round(rect.x - $(canvas).offset().left + $(window).scrollLeft());
		let y = Math.round(rect.y - $(canvas).offset().top + $(window).scrollTop() + $(input).height());
		let fontSize = $(input).css("font-size");
		$(inputWrapper).css("visibility", "hidden");
		$(inputWrapper).css("opacity", "0.0");
		let point = {
			x : x,
			y : y,
		};
		currLine.drawingMode = "TEXT";
		currLine.points = [];
		currLine.points.push(point);
		currLine.text = text;
		currLine.top = $(input).css("top");
		currLine.left = $(input).css("left");
		currLine.id = lineId;
		lineList.push(currLine);
		let tempLineList = lineList;
		currLine = null;
		clearDraw();
		lineList = tempLineList;
		tempLineList = [];
		deletedLineList = [];
		
		sizeUpdate();
		firstPoint = null;
		endPoint = null;
		isTexting = false;
		$(this).unbind("blur");
	}

	function getDrawingPoint(event) {
		if (event.touches) {
			event = event.touches[0]
		}
		var point = {
			x : Math.round(event.clientX - $(canvas).offset().left + $(window).scrollLeft()),
			y : Math.round(event.clientY - $(canvas).offset().top + $(window).scrollTop())
		};
		return point;
	};

	function drawLine(point1, point2) {
		context.save();
		context.scale(1,1);
		context.lineWidth = lineSize;
		context.strokeStyle = lineColor;
		context.globalAlpha = lineOpacity;

		context.lineJoin = "round";
		context.lineCap = "round";

		if(eraserFlag) 
		{
			context.globalCompositeOperation = "destination-out";
			context.globalAlpha = 1;
		}
		else
		{
			context.globalCompositeOperation = "source-over";
		}

		context.beginPath();
		context.moveTo(point1.x, point1.y);
		context.lineTo(point2.x, point2.y);
		context.stroke();

		context.restore();
	}
	
	function drawRect(point1, point2){
		context.save();
		context.scale(1,1);
		context.lineWidth = lineSize;
		context.strokeStyle = lineColor;
		context.globalAlpha = lineOpacity;

		context.lineJoin = "round";
		context.lineCap = "round";

		if(eraserFlag) 
		{
			context.globalCompositeOperation = "destination-out";
			context.globalAlpha = 1;
		}
		else
		{
			context.globalCompositeOperation = "source-over";
		}
		
		context.beginPath();
		context.strokeRect(point1.x,point1.y,point2.x-point1.x,point2.y-point1.y);
		
	    context.restore();
	}
	
	function drawCircle(point1, point2){
		context.save();
		context.scale(1,1);
		context.lineWidth = lineSize;
		context.strokeStyle = lineColor;
		context.globalAlpha = lineOpacity;

		context.lineJoin = "round";
		context.lineCap = "round";

		if(eraserFlag) 
		{
			context.globalCompositeOperation = "destination-out";
			context.globalAlpha = 1;
		}
		else
		{
			context.globalCompositeOperation = "source-over";
		}
		
		context.beginPath();
		var rx = (point2.x-point1.x)/2;
		var ry = (point2.y-point1.y)/2;
		var r = Math.sqrt(Math.pow(point2.x-point1.x,2)+Math.pow(point2.y-point1.y,2)) / 2;
        context.arc((point1.x + rx),(point1.y + ry),r,0,Math.PI*2);
        context.stroke();
	    context.restore();
	}

	function drawText(text, x, y, fontSize)
	{
		context.save();
		context.scale(1,1);
		context.lineWidth = lineSize;
		context.strokeStyle = lineColor;
		context.globalAlpha = lineOpacity;

		context.lineJoin = "round";
		context.lineCap = "round";
		context.font = fontSize;

		if(eraserFlag) 
		{
			context.globalCompositeOperation = "destination-out";
			context.globalAlpha = 1;
		}
		else
		{
			context.globalCompositeOperation = "source-over";
		}
		
		context.beginPath();
        context.fillText(text, x, y);
	    context.restore();
	}

	function getLineList() {
		return lineList;
	}
	this.getLineList = getLineList;
	
	function setLineList(_lineList) {
		lineList = _lineList;
	}
	this.setLineList = setLineList;

	function restoreDrawingResize(_lineList) {
		clearDraw();
		lineList = _lineList;
		for(var i = 0; i < lineList.length; i++) {
			var line = lineList[i];
			let initialWidth = line.width;
			let initialHeight = line.height;
			let currentWidth = $("#drawing_board").width();
			let currentHeight = $("#drawing_board").height();
			
			let ratew = currentWidth / initialWidth;
			let rateh = currentHeight / initialHeight;
			
			let drawingMode = line.drawingMode;
			
			let points = line.points;

			let lineColor = line.color;
			let lineSize = line.size;
			let lineOpacity = line.opacity;
			let eraserFlag = line.eraserFlag;

			for(var j = 0; j < points.length; j++) {
				var point1 = points[j - (j == 0 ? 0 : 1)];
				var point2 = points[j];
				context.save();
				
				context.scale(ratew,rateh);
				context.beginPath();
				
				if(drawingMode == "RECTANGLE")
				{
					context.rect(point1.x,point1.y,point2.x-point1.x,point2.y-point1.y);
					context.restore();
					
					context.lineWidth = lineSize;
					context.strokeStyle = lineColor;
					context.lineOpacity = lineOpacity;

					context.lineJoin = "round";
					context.lineCap = "round";

					if(eraserFlag) {
						context.globalCompositeOperation = "destination-out";
						context.globalAlpha = 1;
					}
					else
					{
						context.globalCompositeOperation = "source-over";
					}
					
					context.stroke();
					
				}
				else if(drawingMode == "CIRCLE")
				{
					let rx = (point2.x-point1.x)/2;
					let ry = (point2.y-point1.y)/2;
					let r = Math.sqrt(Math.pow(point2.x-point1.x,2)+Math.pow(point2.y-point1.y,2)) / 2;
			        context.arc((point1.x + rx),(point1.y + ry),r,0,Math.PI*2);
			        context.restore();
					
					context.lineWidth = lineSize;
					context.strokeStyle = lineColor;
					context.lineOpacity = lineOpacity;

					context.lineJoin = "round";
					context.lineCap = "round";

					if(eraserFlag) {
						context.globalCompositeOperation = "destination-out";
						context.globalAlpha = 1;
					}else
					{
						context.globalCompositeOperation = "source-over";
					}
					
			        context.stroke();
				}
				else if(drawingMode == "TEXT")
				{
					context.fillStyle = lineColor;
					let fontSize = line.fontSize;
					let text = line.text;
					drawText(text, point1.x, point1.y, fontSize);
					context.restore();
					
					//relocate input div
					let id = line.id;
					let originWidth = line.width;
					let originHeight = line.height;
					let currentWidth = $("#drawing_board").width();
					let currentHeight = $("#drawing_board").height();
					let xRate = currentWidth / originWidth;
					let yRate = currentHeight / originHeight;
					let input = $("#"+id+" .input-text");
					let originTopStr =  line.top;
					let originTop = parseInt(originTopStr.substring(0, originTopStr.indexOf("px")));
					let originLeftStr =  line.left;
					let originLeft = parseInt(originLeftStr.substring(0, originLeftStr.indexOf("px")));
					$(input).css("top",originTop*yRate).css("left", originLeft*xRate);
				}
				else
				{
					context.moveTo(point1.x, point1.y);
					context.lineTo(point2.x, point2.y);
					context.restore();
					
					context.lineWidth = lineSize;
					context.strokeStyle = lineColor;
					context.lineOpacity = lineOpacity;

					context.lineJoin = "round";
					context.lineCap = "round";

					if(eraserFlag) {
						context.globalCompositeOperation = "destination-out";
						context.globalAlpha = 1;
					}else
					{
						context.globalCompositeOperation = "source-over";
					}
					
					context.stroke();
				}
			}
		}
	}
	
	function sizeUpdate() {
		canvas.width = $(".drawing_board").width();
		canvas.height = $(".drawing_board").height();
		restoreDrawingResize(lineList);
	}
	this.sizeUpdate = sizeUpdate;

	function clearDraw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		lineList = [];
		resetEraserConfig();
	}
	this.clearDraw = clearDraw;
	
	function undo() {
		if(lineList.length  > 0)
		{
			deletedLineList.push(lineList.pop());
			let temp = lineList;
			clearDraw();
			lineList = temp;
			sizeUpdate();
		}
	}
	this.undo = undo;

	function redo() {
		if(deletedLineList.length > 0)
		{
			lineList.push(deletedLineList.pop());
			let temp = lineList;
			clearDraw();
			lineList = temp;
			sizeUpdate();
		}
	}
	this.redo = redo;
	
	function getCanvasSize() {
		return {
			width: canvas.width,
			height: canvas.height
		};
	}
	this.getCanvasSize = getCanvasSize;

	function setLineSize(size) {
		lineSize = size;
	}
	this.setLineSize = setLineSize;

	function getLineSize() {
		return lineSize;
	}
	this.getLineSize = getLineSize;

	function setLineColor(color) {
		lineColor = color;
	}
	this.setLineColor = setLineColor;

	function getLineColor() {
		return lineColor;
	}
	this.getLineColor = getLineColor;

	function setLineOpacity(opacity) {
		lineOpacity = opacity;
	}
	this.setLineOpacity = setLineOpacity;

	function getLineOpacity() {
		return lineOpacity;
	}
	this.getLineOpacity = getLineOpacity;

	function setEraserFlag(flag) {
		eraserFlag = flag;
	}
	this.setEraserFlag = setEraserFlag;

	function getEraserFlag() {
		return eraserFlag;
	}
	this.getEraserFlag = getEraserFlag;

	function usePencil() {
		resetEraserConfig();
		drawingMode = "PENCIL";
	}
	this.usePencil = usePencil;

	function useLine() {
		resetEraserConfig();
		drawingMode = "LINE";
	}
	this.useLine = useLine;

	function useRectangle() {
		resetEraserConfig();
		drawingMode = "RECTANGLE";
	}
	this.useRectangle = useRectangle;

	function useCircle() {
		resetEraserConfig();
		drawingMode = "CIRCLE";
	}
	this.useCircle = useCircle;

	function useText() {
		resetEraserConfig();
		drawingMode = "TEXT";
	}
	this.useText = useText;
	
	function useCursor() {
		resetEraserConfig();
		drawingMode = "CURSOR";
	}
	this.useCursor = useCursor;
	
	function setOpenDropdown(open)
	{
		openDropdown = open;
	}
	this.setOpenDropdown = setOpenDropdown;

	function getOpenDropdown()
	{
		return openDropdown;
	}
	this.getOpenDropdown = getOpenDropdown;

	function scaleCtx(rate) {
		context.scale(rate, rate);
	}
	this.scaleCtx = scaleCtx;
	
	function exportJson() {
		var obj = {
			size: getCanvasSize(),
			lineList: getLineList()
		};

		return JSON.stringify(obj);
	}
	this.exportJson = exportJson;
	
	function resetEraserConfig() {
		context.globalCompositeOperation = "source-over";
		lineSize = 2;
		lineOpacity = 1.0;
		eraserFlag = false;
	}
	this.resetEraserConfig = resetEraserConfig;

	init();
}