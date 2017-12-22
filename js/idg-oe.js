/**
IDG demo JS
Provided to demo & review UI design concept work on IDG idg.knowego.com
Loaded on all pages, js activates depending on the DOM setup
**/
var idg = idg || {};

idg.init = function(){	
	
	/**
	used across OE UI	
	**/ 
	
	// OpenEyes logo, info and theme switcher
	var openeyes = new idg.PopupBtn( 'logo', $('#js-openeyes-btn'), $('#js-openeyes-info') );
	
	// Shortcuts Nav in <header> 
	var shortcuts = new idg.PopupBtn( 'shortcuts', $('#js-nav-shortcuts-btn'), $('#js-nav-shortcuts-subnav') );
	shortcuts.useWrapper( $('#js-nav-shortcuts') );
	
	// Activity panel
	var activity = new idg.PopupBtn( 'activity', $('#js-nav-activity-btn'), $('#js-activity-panel') );
	
	/*
	check browser size for fixing Activity Panel
	but don't fix Activity Panel in OEscape
	*/
	if( ! $('#oescape-layout').length ){
		// check it
		checkBrowserSize();
		
		// resize
		$( window ).resize(function() {
			checkBrowserSize();
		});
		
		function checkBrowserSize(){	
	  		if( $( window ).width() > 1800){ // min width for fixing Activity Panel (allows some resizing)
				activity.fixed( true );
			} else {
				activity.fixed( false );
			}
		};  
	}
	

	/**
	Patient Banner, used in SEM	
	**/ 
	
	if( $('#oe-patient-details').length ){
		idg.patientPopups.init();
	}
		
									
};

$(document).ready(function() {
	// init
	idg.init();
	
});
/**
Manage Patient Popups to avoid them overlapping	
**/
idg.patientPopups = {
	
	init:function(){
		// patient popups
		var quicklook = new idg.PopupBtn( 'quicklook', $('#js-quicklook-btn'), $('#patient-summary-quicklook') );
		var demographics = new idg.PopupBtn( 'demographics', $('#js-demographics-btn'), $('#patient-popup-demographics') );
		var risks = new idg.PopupBtn( 'risks', $('#js-allergies-risks-btn'), $('#patient-popup-allergies-risks') );
		var tasks = new idg.PopupBtn( 'tasks', $('#js-tasks-btn'), $('#patient-popup-tasks') );
		
		var all = [ quicklook, demographics, risks, tasks ];
		for( pBtns in all ) all[pBtns].inGroup( this ); // register group with PopupBtn 
		
		this.popupBtns = all;
	},

	closeAll:function(){
		for( pBtns in this.popupBtns ) this.popupBtns[pBtns].hide();  // close all patient popups
	}

}

/**
Create 'buttons' for nav menus, 3 different flavours: standard, wrapped and fixed
- standard: $btn open/closes the popup $content (seperate DOM element). MouseEnter/Leave provides increased functionality for non-touch users
- wrapped: 'btn' & popup $content wrapped by shared DOM (shortcuts menu), wrapper is used for the eventObj
- fixed: When the browser width is wide enough CSS fixes open the Activity Panel 
@ $btn - structurally as <a> but without CSS pseudos :hover, :focus, :active
@ $content - DOM content to show on click 
@ wrap - shortcuts has a DOM wrapper, this displays on hover.
**/
idg.PopupBtn = function(id,$btn,$content){
		
	// private
	var id = id,
		eventObj = $btn,
		useMouseEvents = false,
		isGrouped = false, 		// e.g. patient popups 
		groupController = null,
		isFixed = false,
		css = { 
			active:'active', 	// hover
			open:'open' 		// clicked 
		};	
		
	/**
	public methods
	**/
	this.hide = hide;	
	this.useWrapper = useWrapperEvents;
	this.fixed = fixed;
	this.inGroup = inGroup;
	
		
	init(); // all are initiate, but useWrapperEvents modifies the eventObj
		
	/**
	provide a way for shortcuts to re-assign
	the Events to the DOM wrapper
	**/
	function init(){
		// Events
		eventObj.click(function( e ){
			e.stopPropagation();
			// use $btn class as boolean
			changeContent( $btn.hasClass( css.open ) );
		})
		.mouseenter(function(){
			$btn.addClass( css.active ); 
			if( useMouseEvents ) show();
		})
		.mouseleave(function(){
			$btn.removeClass( css.active ); 
			if( useMouseEvents ) hide();
		});
	}

	function changeContent( isOpen ){
		if(isFixed) return; // if popup is fixed
			
		if( isOpen ){
			hide();
		} else {
			if(isGrouped) groupController.closeAll(); 
			show();
		}
	}
	
	function show(){
		$btn.addClass( css.open );
		$content.show();
		if( ! useMouseEvents &&  ! isFixed  ) addContentEvents();
	}
	
	function hide(){
		$btn.removeClass( css.open );
		$content.hide();
	}	
	
	/**
	Enhance $content behaviour for non-touch users
	Allow mouseLeave to close $content popup
	**/
	function addContentEvents(){
  		$content.mouseenter(function(){
	  		$(this).off( 'mouseenter' ); // clean up
			$(this).mouseleave(function(){
				$(this).off( 'mouseleave' ); // clean up
				hide();
			});
		});
	}

	/**
	DOM structure for the Shortcuts dropdown list is different
	Need to shift the events to the wrapper DOM rather than the $btn	
	**/
	function useWrapperEvents( DOMwrapper ){
		eventObj.off('click mouseenter mouseleave');
		eventObj = DOMwrapper;
		css.open = css.active; // wrap only has 1 class
		useMouseEvents = true;
		init(); // re initiate with new eventObj
	}
	
	/**
	Activity Panel needs to be fixable when the browsers is wide enough
	(but not in oescape mode)	
	**/
	function fixed( b ){
		isFixed = b;
		if( b ){
			$content.off( 'mouseenter mouseleave' );  		
			show();
		} else {
			hide(); 
		}
	}
	
	/**
	Group popups to stop overlapping	
	**/
	function inGroup( controller ){
		console.log( controller );
		isGrouped = true;
		groupController = controller;
	}	
}


