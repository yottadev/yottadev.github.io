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

function displayBlogPosts() {
	var mediumXMLFeed = $.parseXML(sessionStorage.getItem("mediumXMLFeed"));
	$(mediumXMLFeed).find("item").each(function () {
		var title = $(this).find("title").text();
		var date = Date.parse($(this).find("pubDate").text());
		date = new Date(date);
		var monthName = date.toLocaleDateString("pt-br", { month: "long" });
		var postDate = `${date.getDate()} de ${monthName} de ${date.getFullYear()} às ${date.getHours()}:${date.getMinutes()}`;
		var link = $(this).find("link").text();
		var author = $(this).find("dc\\:creator").eq(0).text();
		var content = $($(this).find("content\\:encoded").text()).html();
		var categories = [];
		$(this).find("category").each(function () {
			categories.push(`<span class="category-chip">${$(this).text()}</span>`);
		});
		categories = categories.join(" ");
		$("#blog-tab").append(`
			<div class="blog-card">
				<div class="card-header">
					<h2 class="post-title">${title}</h2>
				</div>
				<div class="card-body">
					<p class="post-publish-date">Publicado no dia ${postDate}<br>por ${author}</p>
					<div class="post-content">${content}</div>
				</div>
				<div class="card-footer">
					<a href="${link}" target="_blank" class="post-expand-btn">
						<span class="expand-btn-text">Continuar lendo</span>
						<i class="fas fa-external-link-alt"></i>
					</a>
					<div class="post-categories">${categories}</div>
				</div>
			</div>
		`);
	});
}

var XMLparser = new DOMParser();
if (sessionStorage.getItem("mediumXMLFeed")) {
	var mediumXMLFeed = sessionStorage.getItem("mediumXMLFeed");
	displayBlogPosts();
} else {
	fetch("https://cors-anywhere.herokuapp.com/https://medium.com/feed/@henriqueborgeshbr")
		.then(response => response.text())
		.then((response) => {
			sessionStorage.setItem("mediumXMLFeed", response);
			displayBlogPosts();
		});
}

// Trigger expandable menu
$(document).on("click", ".hamburguer-icon", (e) => {
	if ($(e.target).closest(".hamburguer-icon").hasClass("opened")) {
		closeExpandableMenu();
	} else {
		openExpandableMenu();
	}
});

// Blur the fixed header on scroll down
$(".carousel-cell").on("scroll", function (e) {
	if ($(e.target).scrollTop() > 0) {
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

	// Set both width and display properties on the "Read more" button avoid animation and sizing issues
	$(".post-expand-btn").width($(".post-expand-btn").width());
	$(".post-expand-btn").css("display", "flex");

	// Enable flickity on the page tabs
	var slidingTabs = $("#container-body").flickity({
		cellAlign: "left",
		contain: true,
		setGallerySize: false,
		prevNextButtons: false,
		pageDots: false,
		dragThreshold: 15
	});

	var actualTab = 0;

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
		$("#container-body .carousel-cell").eq(actualTab).animate({scrollTop: 0}, "slow");
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
		actualTab = index
	});

	slidingTabs.on("settle.flickity", function () {
		// Re-enable the scroll bars on finish scrolling
		$(".carousel-cell").css("overflow", "auto");
	});
});