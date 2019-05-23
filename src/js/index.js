// jQuery plugins
$.fn.isAfter = function (sel) {
	return this.prevAll().filter(sel).length !== 0;
};

$.fn.isBefore = function (sel) {
	return this.nextAll().filter(sel).length !== 0;
};

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

// Open tabs
$(document).on("click", "[data-tab]", (e) => {
	if (!animationRunning) {
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
			animationRunning = false;
			closeExpandableMenu();
			animationRunning = true;
		}
		$(".container-body").css("max-height", "calc(100vh - 98.65px)");
		$(".container-body").css("transform", `translate3d(-${tabPercentage * tabIndex}%, 0, 0)`);
		var tabContentHeightLimit = $(".container-body .tab-content").eq(tabIndex).height();
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		$(".container-body").one("transitionend", () => {
			$(".container-body").css("max-height", tabContentHeightLimit);
			animationRunning = false;
		});
	}
});

// Trigger expandable menu
$(document).on("click", ".hamburguer-icon", (e) => {
	if ($(e.target).closest(".hamburguer-icon").hasClass("opened")) {
		closeExpandableMenu();
	} else {
		openExpandableMenu();
	}
});

$(window).on("scroll", () => {
	if ($(".container-header").offset().top > 0) {
		$(".container-header").addClass("blurred-container-header");
	} else {
		$(".container-header").removeClass("blurred-container-header");
	}
});

// Resize the container body height to about tab height
$(window).on("load", () => {
	$(".container-body").css("max-height", $("#about-tab").height());
});

function listRepos() {
	let githubData = JSON.parse(localStorage.getItem("github-data"));
	githubData.forEach((i) => {
		if (i.long_desc == undefined) {
			i.long_desc = "Descrição não encontrada!";
		}
		$(".repo-container").append(`
			<div class="wrapper">
				<div class="card">
					<input class="more" id="${i.name}" type="checkbox" />
					<div class="content">
						<div class="front">
							<div class="inner">
								<h2 class="project-name">${i.name}</h2>
								<p class="project-short-description">${i.description}</p>
								<label class="button" for="${i.name}" aria-hidden="true">Detalhes</label>
							</div>
						</div>
						<div class="back">
							<div class="inner">
								<div class="repo-data">
									<div class="location">${i.name}</div>
									<a class="price" href="${i.html_url}">Github</a>
								</div>
								<div class="repo-info">
									<div class="info">
										<span>${i.stargazers_count}</span>
										<div class="icon"><i class="fas fa-star"></i>
											<span>stars</span>
										</div>
									</div>
								</div>
								<div class="description">
									<p>${i.long_desc}</p>
								</div>
								<label class="button return" for="${i.name}" aria-hidden="true">
									<i class="fas fa-arrow-left"></i>
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		`);
	});
}

let actualTime = new Date().getTime();
let githubDataTimestamp = parseInt(localStorage.getItem("github-data-timestamp"));
// Verify if 10 minutes have passed since the last API call
if (actualTime < githubDataTimestamp + 300000) {
	let minutesSinceLastAPICall = Math.floor(((actualTime - githubDataTimestamp) / 1000) / 60);
	let secondsSinceLastAPICall = Math.floor(((actualTime - githubDataTimestamp) / 1000) - minutesSinceLastAPICall * 60);
	$(".api-call-countdown").innerHTML = `${minutesSinceLastAPICall} minute(s) and ${secondsSinceLastAPICall} second(s) since the last API call`;
	listRepos();
} else {
	// Fetch all repos from my account
	fetch("https://api.github.com/users/henriquehbr/repos")
		.then(response => response.json())
		.then((repoData) => {
			repoData.forEach((i) => {
				// Fetch the readme from the actual repo
				fetch(`https://raw.githubusercontent.com/henriquehbr/${i.name}/master/README.md`)
					.then(response => response.text())
					.then((descData) => {
						let longDescRegex = /\[\/\/\]\:\ \<\>\ \((.*?)\)/gm;
						let longDesc = longDescRegex.exec(descData);
						if (longDesc !== null) {
							let repoIndex = repoData.indexOf(i);
							repoData[repoIndex].long_desc = longDesc[1];
							localStorage.setItem("github-data", JSON.stringify(repoData));
							localStorage.setItem("github-data-timestamp", actualTime);
							listRepos();
						}
					});
			});
		});
}

$(() => {
	particlesJS.load("particles", "dist/particles.json");
});