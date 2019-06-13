
// ############################################################################
let  margin = {top: 5, right: 50, bottom: 100, left: 100},
	padding = 40,
	outerWidth = window.innerWidth-150, 
	outerHeight = window.innerHeight*0.8 ,
    Width = outerWidth - margin.left - margin.right ,//  window's width 
  	Height = outerHeight - margin.top - margin.bottom; // window's height

  

 let barhight = 30;	

// ############################################################################
let svg = d3.select('#Bchart')
	.append('svg')
	.attr("class","svg")
	.attr("width", outerWidth)
    .attr("height", outerHeight)
	.style('background','#a7afaf')
    .attr("transform", "translate(" + 50 + ", " + 0 + ")");

let g1 = svg.append("g").attr("class", "g1") 
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // ##############################################################################
//defining color scale for candidates
let colors = new Object();
	colors = {"NA"	: "#a21700", 
			  "FA"  : "#131413", 
			  "JC"  : "#464a4c", 
			  "NDA" : "#0088c6",  
			  "FF"  : "#75bbe2", 
			  "BH"  : "#f39dc7", 
			  "JL"  : "#cee9f8",  
			  "MLP" : "#83726d",
			  "EM"  : "#FFD75C",  
			  "JLM" : "#de2707", 
			  "PP"  : "#f96f43"
			};

let ranks = ["1","2","3","4","5","6","7","8","9", "10", "11"];

let official_order = ["NDA", "MLP", "EM", "BH", "NA", "PP", "JC", "JL", "JLM", "FA", "FF"],
	Alphabetical   = ["NA" ,"FA","JC","NDA", "FF" ,"BH" ,"JL" ,"JLM","MLP", "EM" , "PP" ],
	Left2Right 	   = ["NA", "PP", "JLM", "BH", "EM","JL", "FF", "NDA", "MLP", "JC", "FA"],
	Random         = ["JC", "PP","JL",  "BH", "FF", "NDA","JLM", "MLP","NA",  "FA", "EM"];	

// ############################################################################
function mycolor( d ){
	return colors[d];
};
// ############################################################################
let xscale,xscale2 ,yscale,
	xAxis,yAxis,scaleHeight,
	scaleWidth,xAxisGroup,
	xAxisGroup2,yAxisGroup ,
	ScoreVector = "BordaScore" , mapRanks ; 
let data,value,weight, updateWidth, selection1;
// ############################################################################
let  DefineScales = function(){

	// Define the Extent for each x-y_axis
	xscale = d3.scalePoint()
				.domain(ranks)
				.range([padding, Width/2-padding]);
	
	yscale = d3.scalePoint()
				.domain(Left2Right)
 				.range([Height, 0])
 				.padding(1);

	xscale2 = d3.scaleLinear()
				.domain([0,d3.max(TRweights)+50])
				.range([Width/2+padding  , Width-margin.right]).nice();

	scaleHeight= d3.scaleLinear()
				    .domain(d3.extent(VotersEach))
				    .range([1, 60]);

	scaleWidth = d3.scaleLinear()
					  .domain([ 1  , 11])
					  .range([1, 40]);
	
};
// ############################################################################
let  DefineAxes = function(){
	xAxis =  d3.axisBottom(xscale);
	yAxis =  d3.axisLeft(yscale);
	xAxis2 = d3.axisBottom(xscale2);						  
 	
};

// ############################################################################
CreatAxesGroup = function(){
		//Call the x-axis in a group tag 'g'
	 xAxisGroup = g1.append("g")
	    .attr("class", "xAxis")
	    .attr("transform", "translate(0," + Height + ")")
	    .style('font-size', '17px'); 

	 xAxisGroup2 = g1.append("g")
	    .attr("class", "xAxis2")
	    .attr("transform", "translate(" +0 + "," + Height + ")")
	    .style('font-size', '17px')

	//Call the y-axis in a group tag 'g'
	 yAxisGroup = g1.append("g")
	    .attr("class", "yAxis")
	    .style('font-size', '14px');
	};

// ############################################################################
CallAxesforAxesGroup = function(){
	xAxisGroup.call(xAxis);
	yAxisGroup.call(yAxis)
			  .selectAll('text')
		      .attr("text-anchor", 'end')
		      .style("font-size","20px")
		      .attr("transform", "rotate(30)");

	xAxisGroup2.call(xAxis2)
				.selectAll('text')
			    .attr("text-anchor", 'end')
			    .attr("transform", "rotate(-60)");
 	
};
// ############################################################################
AddLabels2Chart = function(){
	// // text label for the x axis
	svg.append("text") 
		  .attr("class","CRuleTxt")            
	      .attr("transform","translate(" + (Width/3) + " ," + (Height + 80 ) + ")")
	      .style("text-anchor", "middle")
	      .text( "Ranks" );
// // text label for the x axis2
	svg.append("text")
		  .attr('class',"BSTxt" )            
	      .attr("transform","translate(" + (Width*4/5) + " ," + (Height + 80 ) + ")")
	      .style("text-anchor", "middle")
	      .text( "Scores" );

	//   // text label for the y axis
	svg.append("text")
	      .attr("x", -Height/2)
	      .attr("y", 10 )
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .attr("transform", "rotate(-90)")//NOTE: x and y are swapped
	      .text("<---------Candidates--------->");      
	};
// ############################################################################
AddBorder2Chart = function(){
	// //adding border to SVG
	svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", outerHeight)
		.attr("width", outerWidth)
		.style("stroke", 'blue')
		.style("fill", "none")
		.style("stroke-width", 4);
	};
// ############################################################################

// ############################################################################
let sortingOrder, rectgroup;
// ############################################################################
DrawChart = function(data){
	if ( ScoreVector === "BordaScore"){
		value =  "Rweights";
		weight = "Tweight"
		updateWidth = x=>scaleWidth(12-x)
	}else{
		value = "NewRweights";
		weight = "KTweight";
		updateWidth = x=>40;
	}

	//First pass 
	rectgroup =   g1.selectAll('.rectgroup')
					.data( data['candidates'] )
					.enter()
					.append('g')
					.attr('class', "rectgroup")
				
	//Second pass
	rectgroup.selectAll('.rectgroup')
					.data(d=>{
						let A=[];
						d3.entries(d[value]).forEach(e=>{
							let tmp = {name: d.Name, key :e.key ,value:e.value};
								A.push(tmp);
							})
						
						return( A );
					}) 
					.enter()
					.append('rect')
					.attr("class", "rects barclass")//barclass would be applied when mouse over
	 	
		rectgroup.append('rect')
				 .attr("class", "scoreRect barclass");//Don't forget to use attr(fill)NOT style later on


		rectgroup.selectAll(".rects")
					 .attr('x',0)
					 .attr('y',0)
					 .attr('height', 0)
				   	 .attr('width', 10)
					 .attr('fill', 'green')
					 .transition()
					 .duration(500)
		    		 .attr( "x",v=>mapRanks(v.key)	)
				 	 .attr( "y",v=>yscale(v.name)-scaleHeight(v.value)/2 )
				 	 .attr('height', v => scaleHeight(v.value))
				   	 .attr('width', v => scaleWidth(12-v.key))
				     .attr("fill", v=>mycolor(v.name) );
				    
		rectgroup.selectAll(".scoreRect")
					.attr('fill', d=>colors[d.Name])
				    .attr('height', barhight)
				    .attr('y',d=>yscale(d.Name) )//we need y to be at the center of the bars 
				    .attr('width', 0)
				    .attr('x', Width/2 + padding)
				    .transition()
					  .attr('width', d=>  xscale2( d[weight])-Width/2-margin.right )//here we re-assign witdth for bars
					  .attr('y', d=>(yscale(d.Name)-15 ) )
					  .delay((v,i)=> i*30 )
					  .duration(500)
					  .ease(d3.easeLinear);
			
}

//############################################################################
sliceThisObject = 	function(object, keys) {
		    return Object.keys(object)
		        .filter(function (key) {
		            return keys.indexOf(key) >= 0;
		        })
		        .reduce(function (acc, key) {
		            acc[key] = object[key];
		            return acc;
		        }, {});
		};

//############################################################################	
UpdateChart = function(newdata){
   if ( ScoreVector === "BordaScore"){
   			value =  "Rweights";
   			weight = "Tweight"
   			updateWidth = x=>scaleWidth(12-x)
   		}else{
   			value = "NewRweights";
   			weight = "KTweight";
   			updateWidth = x=>40;
   		}

   	//Here a good idea is to JOIN new data to each selection separately.
	let selection1 = d3.selectAll('.rectgroup')
					  .data( newdata['candidates'] );
	

	let selection2 = selection1.selectAll('.rects')
			 .data(d=>{
						let A=[];
						d3.entries(d[value]).forEach(e=>{
							let tmp = {name: d.Name, key :e.key ,value:e.value};
								A.push(tmp);
							})
					return( A );
					})/*.style('fill', 'blue');*/

	let selection3 = d3.selectAll(".scoreRect")
						.data(newdata['candidates']);

	
	// EXIT() Phase   ###########################################################
	selection1.exit().remove();
	selection2.exit().transition().duration(100).remove().attr('height', 0 ).attr('width',0);
	selection3.exit().remove(); 

	// UPDATE() Phase ###########################################################
	selection2
				.attr( "x",v=>mapRanks(v.key))
				.attr( "y",v=>yscale(v.name)-scaleHeight(v.value)/2 ) //scaleHeight(v.value)
		 	 	.attr('height', v =>scaleHeight(v.value) )
		 	 	.attr("fill", v=>mycolor(v.name) )
		 	 	.transition()
		 	 	.duration(1)
		   		.attr('width',v=>updateWidth(v.key))


	selection3 .attr('y',d=>yscale(d.Name) -15)
				.attr('fill', d=>colors[d.Name])
				// .attr('width', d=> xscale2(d[weight])-Width/2-margin.right )
				// .transition().duration(1000) 
				// .attr('width', d=> 0 )
				.transition().duration(1)
			    .attr('width', d=> xscale2(d[weight])-Width/2-margin.right )//here we re-assign witdth for bars
				

	// ENTER() phase if there are additional data ###############################
	selection2.enter().append('rect').attr("class" , "rects barclass")
				.attr( "x",v=>mapRanks(v.key))
				.attr( "y",v=>yscale(v.name)-scaleHeight(v.value)/2 )
		 	 	.attr('height', v => scaleHeight(v.value))
		 	 	.transition()
		 	 	.duration(1)
		 	 	.attr('width',v => updateWidth(v.key))
		 	 	.attr("fill", v=>mycolor(v.name) );

	// console.log("DONNNE");
	selection3.enter().append('rect').attr("class" , "scoreRect barclass")
					.attr('fill', d=>colors[d.Name])
				    .attr('height', barhight)
				    .attr('x', Width/2 + padding)
				    .attr('y', d=>(yscale(d.Name)-15 ) )
				    .transition()
					.attr('width', d=>  xscale2(d[weight])-Width/2-margin.right )//here we re-assign witdth for bars
					.ease(d3.easeLinear);
	
	AddToolTip2Chart();	 
};
// ############################################################################
SetDefaultSelection = function(){
	$("#selectOrder").val("Left2Right");
	$("#scoringVector").val("Plurality");
	k = 1;
	RangeSlider.ResetTo(k);

	ScoreVector = "Plurality";
	mapRanks = function (x){return ( xscale(x) - 20 );};
};
let  TRweights , candidates, Winner2Loser, VotersEach=[], k = 1;
// ############################################################################
Winner2LoserArray = function(cdata){
	let weight = (ScoreVector === "BordaScore") ?  "Tweight":"KTweight";
	// if( ScoreVector === "BordaScore"){
	// 		weight = "Tweight";
	// }else{
	// 		weight = "KTweight";
	// }

	Winner2LoserObjects = cdata.sort((a,b)=>(a[weight]-b[weight]));//sorting data in ascending manner
	return Winner2LoserObjects.map(d=>d.Name); //return names associated to this asc order
};
// ############################################################################
FilterOutData4kApproval = function(data){
//mapRanks = function (x){ return ( xscale(x) - scaleWidth(x)/2 )? x===1 : 0 ; };
	mapRanks = function (x){return ( xscale(x) - 20 ); };
	//svg.select(".CRuleTxt").text("Ranks");


	data['candidates'] =  data['candidates'].map( d=>{
			 	let sliceArray = [];
			 	for(let i=1; i<=k ; i++){
			 		sliceArray.push(i.toString())
			 	}
		
			 	let y = sliceThisObject(d['Rweights'], sliceArray);
	 			d['NewRweights'] = y;
	 			d['KTweight'] = d3.sum(Object.values(y));
				 	// console.log(d);	
	 			
	 			return (d);
	 		});
	Winner2Loser = Winner2LoserArray( data['candidates'] );	
	TRweights = data['candidates'].map(d=>d.KTweight);

	UpdateX_Axis2();
};
// ############################################################################
RangeSlider ={
	BackgroundColor:(color)=>{$(".slider").css("background-color", color);},
	Disable: ()=>{$('.slider').prop("disabled", true);
				$('.slider').prop("style('fill', 'red')")}, //disable range Slider
	Enable :()=>$('.slider').prop("disabled", false), //disable range Slider
	ResetTo:(value)=>{
		        $('.slider').prop("value", value);
		        $('.slider_label').html(value);
		       }
};
// ############################################################################

				
//############################################################################
AddToolTip2Chart =	function(){
	tooltip1 = d3.tip().attr('class', 'd3-tip')
		.offset([-5, 0])//offset from each rect.
		.html(d=>{
			let text = "<strong>N_of_Voters:</strong> <span style='color:#1fff23'>" + d3.format(".2f" )(d.value)+ "</span><br>";

			if (ScoreVector==="K-Approval"){
				text += "<strong>Score:</strong> <span style='color:red;text-transform:capitalize'>" +d3.format(".2f" )(d.value) + "</span><br>";
			}else{
				text += "<strong>Score:</strong> <span style='color:red;text-transform:capitalize'>" +d3.format(".2f" )(d.value*(12-d.key)) + "</span><br>";
			};
			return text;
		});
	tooltip2 = d3.tip().attr("class", "d3-tip") //apply d3-tip class
		.offset([-5, 0])//offset from each rect.
		.html(d=>{
			let weight2;
			if(ScoreVector ==="K-Approval" ){
				weight2 = "KTweight" ;
			}else{
				weight2 = "Tweight";
			}

			let text = "<strong>Name :</strong:</strong> <span style='color:#1fff23'>" + d.Name + "</span><br>";
			text += "<strong>TotalScore:</strong :</strong> <span style='color:red'>" + d3.format(".2f" )(d[weight2])+ "</span><br>";


			// console.log(d3.select(this));
			return text;
		})
		d3.selectAll(".rects").call(tooltip1)
				.on("mouseover",tooltip1.show)
				.on("mouseout",tooltip1.hide);

		d3.selectAll(".scoreRect").call(tooltip2)
				.on("mouseover",tooltip2.show)
				.on("mouseout",tooltip2.hide);
	
	}
// ############################################################################
// ##########    Loading jsonData        ######################################
// ############################################################################
 
d3.json("../data/Vdata.json").then(function(data) {

	RangeSlider.BackgroundColor("#9a9e9d");
	RangeSlider.Disable();
	data['candidates'].map(d=>d3.entries(d.Rweights) )
										 .forEach(v=>v.forEach( e=>VotersEach.push(e.value) ) );

	TRweights = data['candidates'].map(d=>d.Tweight);


	//Steps of our visualization
	CreatAxesGroup();//step 1
	DefineScales(); //step 2
	DefineAxes();//step 3	
	CallAxesforAxesGroup();//step 4
	SetDefaultSelection(); //step 5
	FilterOutData4kApproval(data);//step 6
	DrawChart(data);  //step 7
	AddLabels2Chart(); //step 8
	AddBorder2Chart(); //step 9
	ScoreVector ="K-Approval";
	AddToolTip2Chart();//step 10
	//############################################################################
	$("#selectOrder").on("change",function(){
		sortingOrder = $(this).val(); //getting the selected value 

		if(sortingOrder ==="Winner to Loser Order"){
			Winner2Loser = Winner2LoserArray(data['candidates']);
		};
		UpdateYaxis(sortingOrder);
		SortData(data);
		UpdateChart( data );//to update all modified data again
	});
	
	//############################################################################
	
	$("#scoringVector").on("change",function(){
		ScoreVector = $(this).val(); //getting the selected value 
				
		switch (ScoreVector) {
			case "BordaScore":
				RangeSlider.Disable();
				RangeSlider.ResetTo(1);
				RangeSlider.BackgroundColor("#9a9e9d");
				mapRanks = function (x){return ( xscale(x) - scaleWidth(12-x)/2 ); };
				TRweights = data['candidates'].map(d=>d.Tweight);
				UpdateX_Axis2();
			   	(sortingOrder ==="Winner to Loser Order") && SortItAgain(data);
				UpdateChart( data );

				break;
			case "Plurality":
				mapRanks = function (x){return ( xscale(x) - 20 );};
				RangeSlider.BackgroundColor("#9a9e9d");
				RangeSlider.Disable();
				ScoreVector = "K-Approval";
				k = 1;
				RangeSlider.ResetTo(k);
				FilterOutData4kApproval(data);
				UpdateX_Axis2();
				(sortingOrder ==="Winner to Loser Order") && SortItAgain(data);
				UpdateChart(data);

				break;
			case "K-Approval":
				ScoreVector = "K-Approval";
				mapRanks = function (x){return ( xscale(x) - 20 );};
				RangeSlider.Enable();
				RangeSlider.ResetTo(k);
			 	RangeSlider.BackgroundColor("#0be834");
				FilterOutData4kApproval(data);
				UpdateX_Axis2();
				(sortingOrder ==="Winner to Loser Order") && SortItAgain(data);
				UpdateChart(data);

				break;
			case "Veto":
  				RangeSlider.BackgroundColor("#9a9e9d");  				
				RangeSlider.Disable();
				mapRanks = function (x){return ( xscale(x) - 20 );};
			   	ScoreVector = "K-Approval";
				k=10;
				RangeSlider.ResetTo(k);
				FilterOutData4kApproval(data);
				UpdateX_Axis2();
				(sortingOrder ==="Winner to Loser Order") && SortItAgain(data);
				UpdateChart(data);

				break;
			default:
				 mapRanks = function (x){return ( xscale(x) - scaleWidth(x)/2 );};
				break;
		};
	});

	// Range_Slider ############################################################################
	$('.slider').on('input change', function(){  //on input and on change
		$(this).next($('.slider_label')).html(this.value);
			 ScoreVector = "K-Approval";
			 k = this.value;
			 FilterOutData4kApproval(data);
			 UpdateX_Axis2();
			 UpdateChart(data);
		});

	// $('.slider').mouseup(()=>{
	// 	(sortingOrder ==="Winner to Loser Order") && SortItAgain(data);
	// });
	// ############################################################################
	$(".slider").on("change",()=>{ //Update chart again if Winner2Loser is already selected
		
		(sortingOrder ==="Winner to Loser Order") && SortItAgain(data);
	})
	// ############################################################################
}).catch(error=> console.log(error));//d3 v5 error handeling
	// ############################################################################
	// ############################################################################
UpdateX_Axis2 = function(){
		let xAx =  d3.axisBottom(xscale2);
		xscale2.domain([0 ,d3.max(TRweights)+50])
		xAxisGroup2.transition().duration(500).call(xAx)
								.selectAll('text')
				    			.attr("text-anchor", 'end')
				    			.attr("transform", "rotate(-60)");
	};
	// ############################################################################
 UpdateYaxis = 	function(order){
		let yAx =  d3.axisLeft(yscale);
		switch (order) {
				case "Alphabetical Order":
					yscale.domain(Alphabetical);
					break;
				case "Winner to Loser Order":
					yscale.domain(Winner2Loser);
					break;
				case "Left2Right":
					yscale.domain(Left2Right);
					break;
				case "Official Order":
					yscale.domain(official_order);
					break;
				default:
					yscale.domain( (Random) );
					
					break;
			}
			return yAxisGroup.transition().duration(600).call(yAx);//this part will animate Y-axis
	}

	// ############################################################################
 SortData = function(data){
		value = (ScoreVector && "BordaScore") ?  "Rweights":"NewRweights";
		
			g1.selectAll(".scoreRect") //, .rects
				.data(data["candidates"])
				.transition()
				//.duration(500)
				//.attr("x",Width/2+padding)
				.attr("y", d=> yscale(d.Name)-15 );

			g1.selectAll(".rectgroup") 
				.data( data["candidates"] )
				.selectAll(".rects")
				.data( function(d){
						var names = [];
						Object.values(d[value]).forEach( element=> {
							let e = {name :d.Name ,value:element };
						 	names.push(e);
						});
							return names ;
					})
				.transition()
				  //.duration(500)
				  .attr("y", v=>yscale(v.name)-scaleHeight(v.value)/2 );

	};
// ############################################################################
 SortItAgain =  function (data){
 			if (k!=11){//Do not sort candidates if k==11.
				Winner2Loser = Winner2LoserArray(data['candidates']);
				UpdateYaxis(sortingOrder);
				SortData(data);
			}
};
