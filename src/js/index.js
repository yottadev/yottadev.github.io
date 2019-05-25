animationRunning = false;
function openExpandableMenu() {
	if (!animationRunning) {
		animationRunning = true;
		$(".hamburguer-icon").addClass("opened");
		$("html").css("overflow-y", "hidden");
		$(".expandable-menu-element").each((i) => {
			if (i % 2 !== 0) {
				$(".expandable-menu-element").eq(i).addClass("animated slideInLeft faster");
			} else if (i % 2 == 0) {
				$(".expandable-menu-element").eq(i).addClass("animated slideInRight faster");
			}
		});
		$("#expandable-menu").addClass("animated slideInUp faster").css("display", "flex").one("animationend", () => {
			$("#expandable-menu").removeClass("animated slideInUp faster");
			$(".expandable-menu-element").removeClass("animated slideInLeft slideInRight faster");
			animationRunning = false;
		});
	}
}

function closeExpandableMenu() {
	if (!animationRunning) {
		animationRunning = true;
		$(".hamburguer-icon").removeClass("opened");
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
}

// Trigger expandable menu
$(document).on("click", ".hamburguer-icon", (e) => {
	if ($(e.target).closest(".hamburguer-icon").hasClass("opened")) {
		closeExpandableMenu();
	} else {
		openExpandableMenu();
	}
});

$(window).on("scroll", () => {
	console.log("Scrolled!");
	if ($(".container-header").offset().top > 0) {
		console.log("Scrolled below!");
		$(".container-header").addClass("blurred-container-header");
	} else {
		$(".container-header").removeClass("blurred-container-header");
	}
});

$(window).on("load", () => {
	// Show page after loaded
	$("html").css("display", "block");

	// Enable background particles
	//particlesJS.load("particles", "dist/particles.json");

	// Enable flickity on the page tabs
	let slidingTabs = $("#container-body").flickity({
		cellAlign: "left",
		contain: true,
		setGallerySize: false,
		prevNextButtons: false,
		pageDots: false,
		dragThreshold: 15
	});

	$(document).on("click", "[data-tab]", (e) => {
		if ($(e.target).parents("#sliding-tabs-container").length > 0) {
			var sliderMargin = $(e.target).offset().left - $(e.target).parent().offset().left;
			var sliderWidth = $(e.target).width();
			$("#tabs-slider .slider").css("margin-left", sliderMargin);
			$("#tabs-slider .slider").width(sliderWidth);
			slidingTabs.flickity("select", $(e.target).index());
		} else if ($(e.target).parents("#expandable-menu").length > 0) {
			$(".expandable-menu-element").removeClass("active-menu-element");
			$(e.target).addClass("active-menu-element");
			slidingTabs.flickity("select", $(e.target).index());
			closeExpandableMenu();
		}
	});

	slidingTabs.on("change.flickity", function (event, index) {
		// Hide the scrollbars on start scrolling
		$(".carousel-cell").css("overflow", "hidden");
		sliderTabIndex = $("#tabs-container .tab").eq(index);
		// Change the highlighted tab
		var sliderMargin = $(sliderTabIndex).offset().left - $(sliderTabIndex).parent().offset().left;
		var sliderWidth = $(sliderTabIndex).width();
		$("#tabs-slider .slider").css("margin-left", sliderMargin);
		$("#tabs-slider .slider").width(sliderWidth);
		slidingTabs.flickity("select", $(sliderTabIndex).index());

		// Change the highlighted expandable menu element
		$("#expandable-menu .expandable-menu-element").removeClass("active-menu-element");
		$("#expandable-menu .expandable-menu-element").eq(index).addClass("active-menu-element");
		slidingTabs.flickity("select", $(sliderTabIndex).index());
		if ($("#expandable-menu:visible").length == 1) {
			closeExpandableMenu();
		}
	});

	slidingTabs.on("settle.flickity", function () {
		// Re-enable the scroll bars on finish scrolling
		$(".carousel-cell").css("overflow", "auto");
	});
});