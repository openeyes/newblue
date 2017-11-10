// highSTOCK https://api.highcharts.com/highstock/

var drugs = ['Lucentis (7)','Eylea (4)'];
var chartHeight = 650;
var xAxisOffset = 60 * drugs.length; // offset xAxis to allow space for drug banners
var flagYoffset = -35; // drug flags are positioned relative to xAxis 

// resize chart area
function updateChartSize(size){
	chart.setSize( size, chartHeight, false );
}

/*
 * Highchart options (data and positioning only) - all UI stylng is handled in CSS
*/
var options = {
		chart: {
		    events: {
		        load: function() {
		          	drawBanners(this,drugs);
		        },
		        redraw: function(){
		         	drawBanners(this,drugs);
		        }
		    },
			renderTo: 'chart', 					// <div> id
			className: 'oes-chart-mr-right',	// suffix: -right -left or -both (eyes)
		    height: chartHeight, 				// px
		    marginTop:60,						// make px space for Legend
		    // spacing: [10, 10, 15, 10], 		// default: [10, 10, 15, 10] outer edge of the chart and the content (doesn't effect SVG banners)
		    // type: 'line' 					// Can be any of the chart types listed under plotOptions. ('line' default)	
		   
		},
			
		credits: { enabled: false }, // highcharts url (logo) removed
		
		//--- turned off because it now fails as the CSS is doing all the styling:
		// navigation: 	chartNavigation(), // export burger menu popup (module still styled by JS)
		// exporting:	chartExporting(),  
		
	    title: 		chartTitle('Retinal thickness-Visual acuity (Right Eye)'),
	    
	    legend: 	chartLegend(),
		
		navigator: 	chartNavigator(),	// chart Navigator
		
	    yAxis: [{
			title: {
				text: 'CRT (um)',
			}, 
			opposite: true,   
	        reversed: false,
	         
	    },{
			title: {
	        	text: 'VA (ETDRS)',
	      	},
	      	opposite: false,
    	}],
	    
	    
	    xAxis: {
		    offset: xAxisOffset,   // this moves the chart up to allow for the banners
	        title: {
	            text: 'Time Months',
	        },
	        
	        crosshair: {
			 	snap: true
      		},
	       
	        labels: {  
	            y:25,
	        }
	    },
	   
	
	    plotOptions: {
	        series: {
		        animation:false,
	            point: {
	                events: {
	                    mouseOver: function( e ){
		                    oes.changeOCT( this.oct ); // link chart points to OCTs
	                    }
	                }
	            },
	            
	            label: {
		            enabled:false,
	            },
	            
	            marker: {
		            symbol:'circle',
	            }
	        },
	        
	        flags: {
		        shape: "square",
		    	showInLegend: false,
		    	tooltip: {
			    	pointFormatter : function () {
							var s = '<b>'+this.info+'</b>';
							return s;
	        		},
		    	},
	        }
	    },
	    
	
	    series: [{
		    name: '(VA) ETDRS (R)',
		    type:'line',
		    className: 'oes-eye-r',		// CSS class name: 'oes-eye-r' or 'oes-eye-l'
		    colorIndex: 11,				// OES lines 11-13 (right eye): 11 - solid; 12 - dotted; 13 - dashed
		    yAxis: 1,					// link to yAxis
		    showInNavigator: true,
	        data: [		{x:1,y:55,oct:1},
	        			{x:2,y:61,oct:2},
	        			{x:3,y:70,oct:3},
	        			{x:4,y:76,oct:4},
	        			{x:6,y:80,oct:5},
	        			{x:8,y:90,oct:6},
	        			{x:10,y:85,oct:7},
	        			{x:14,y:60,oct:8},
	        			{x:18,y:55,oct:9},
	        ],
	    },{ 
	       name: 'CRT (R)',
	       type:'line',
	       className: 'oes-eye-r',		// CSS class name: 'oes-eye-r' or 'oes-eye-l'
		   colorIndex: 12,				// OES lines 11-13 (right eye): 11 - solid; 12 - dotted; 13 - dashed
		   yAxis: 0,					// link to yAxis
	       showInNavigator: true,
	       data: [		{x:1,y:300,oct:1},
	        			{x:2,y:265,oct:2},
	        			{x:3,y:190,oct:3},
	        			{x:4,y:180,oct:4},
	        			{x:6,y:170,oct:5},
	        			{x:8,y:200,oct:6},
	        			{x:10,y:195,oct:7},
	        			{x:14,y:223,oct:8},
	        			{x:18,y:267,oct:9},
	        ],
	    },{
		    name: "Lucentis", 			// chart label is drawn using drawBanners() helper
		    type: "flags",
			className: 'oes-eye-r',		// CSS class name: 'oes-eye-r' or 'oes-eye-l'
			colorIndex:10,				// OES eye fill: 10 - right eye
		    y: flagYoffset - 50, 		// position over banner rect
		    "data": [
		      {
		        "x": 1,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 2.5,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 2.8,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 4,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 5,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 8,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 8.4,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      }]

	    },{
		    name: "Eylea", 				// chart label is drawn using drawBanners() helper
		    type: "flags",
			className: 'oes-eye-r',		// CSS class name: 'oes-eye-r' or 'oes-eye-l'
			colorIndex:10,				// OES eye fill: 10 - right eye
		    y: flagYoffset, 			// position over banner rect
		    "data": [
		      {
		        "x": 12,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 13,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 15.5,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      },
		      {
		        "x": 16,
		        "title": "R",
		        "info" : "0.4 M, 11D"
		      }]

	    }]

	};
	
var chart = new Highcharts.Chart(options);