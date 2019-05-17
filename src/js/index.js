//particlesJS.load("particles", "dist/particles.json");

// jQuery plugins
$.fn.isAfter = function (sel) {
	return this.prevAll().filter(sel).length !== 0;
};

$.fn.isBefore = function (sel) {
	return this.nextAll().filter(sel).length !== 0;
};

animationRunning = false;

function toggleExpandableMenu() {
	if (animationRunning == false && $(window).width() <= 520) {
		animationRunning = true;
		// Open expandable menu
		$(".hamburguer-icon").toggleClass("opened");
		if ($("#expandable-menu:visible").length == 0) {
			openExpandableMenu();
		} else if ($("#expandable-menu:visible").length == 1) {
			closeExpandableMenu();
		}
	}
}

function openExpandableMenu() {
	$("html").css("overflow-y", "hidden");
	$(".expandable-menu-element").each((i) => {
		if (i % 2 !== 0) {
			$(".expandable-menu-element").eq(i).addClass("animated slideInLeft faster");
		} else if (i % 2 == 0) {
			$(".expandable-menu-element").eq(i).addClass("animated slideInRight faster");
		}
	});
	$("#expandable-menu").addClass("animated slideInUp faster").show().one("animationend", () => {
		$("#expandable-menu").removeClass("animated slideInUp faster");
		$(".expandable-menu-element").removeClass("animated slideInLeft slideInRight faster");
		animationRunning = false;
	});
}

function closeExpandableMenu() {
	$(".expandable-menu-element").each((i) => {
		if (i % 2 !== 0) {
			$(".expandable-menu-element").eq(i).addClass("animated slideOutLeft faster");
		} else if (i % 2 == 0) {
			$(".expandable-menu-element").eq(i).addClass("animated slideOutRight faster");
		}
	});
	$("#expandable-menu").addClass("animated slideOutDown faster").one("animationend", () => {
		$("html, body").css("overflow-y", "visible");
		$("#expandable-menu").removeClass("animated slideOutDown faster");
		$("#expandable-menu").hide();
		$(".expandable-menu-element").removeClass("animated slideOutLeft slideOutRight faster");
		animationRunning = false;
	});
}

// Open tabs
$(document).on("click", "[data-tab]", (e) => {
	if (animationRunning == true) {
		return false;
	}
	animationRunning = true;
	var tabPercentage = 100 / $(".tab-content").length;
	var tabIndex = $(e.target).index();
	if ($(e.target).parents("#sliding-tabs-container").length > 0) {
		var sliderMargin = $(e.target).offset().left - $(e.target).parent().offset().left;
		var sliderWidth = $(e.target).width();
		$("#tabs-slider .slider").css("margin-left", sliderMargin);
		$("#tabs-slider .slider").width(sliderWidth);
	} else if ($(e.target).parents("#expandable-menu").length > 0) {
		$(".expandable-menu-element").removeClass("active-menu-element");
		$(e.target).addClass("active-menu-element");
		// Toggle hamburguer menu
		$(".hamburguer-icon").toggleClass("opened");
		closeExpandableMenu();
	}
	$(".container-body").css("transform", `translate3d(-${tabPercentage * tabIndex}%, 0, 0)`);
	var tabContentHeightLimit = $(".container-body .tab-content").eq(tabIndex).height();
	$("html, body").animate({ scrollTop: 0 }, "slow");
	$(".container-body").css("max-height", tabContentHeightLimit);
	$(".container-body").one("transitionend", () => {
		animationRunning = false;
	});
});

// Trigger expandable menu
animationRunning = false;
$(document).on("click", ".hamburguer-icon", () => {
	toggleExpandableMenu();
});

$(window).on("resize", () => {
	if ($(window).width() > 520) {
		closeExpandableMenu();
		$(".hamburguer-icon").removeClass("opened");
	}
});

$(window).on("scroll", () => {
	if ($(".container-header").offset().top > 0) {
		$(".container-header").addClass("blurred-container-header");
	} else {
		$(".container-header").removeClass("blurred-container-header");
	}
});

// For testing purposes only!
$.each($(".portfolio-item"), function () {
	var randomHeight = Math.ceil(Math.random() * (500 - 100) + 100);
	$(this).css({
		"height": `${randomHeight}px`,
		"line-height": `${randomHeight}px`
	});
});

// Resize the container body height to about tab height
$(window).on("load", () => {
	$(".container-body").css("max-height", $("#about-tab").height());
});