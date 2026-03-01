(() => {
	var stored = localStorage.getItem("amt-theme");
	var theme = stored === "dark" || stored === "light" || stored === "system" ? stored : "system";
	var root = document.documentElement;
	root.classList.remove("light", "dark");
	if (theme === "dark") root.classList.add("dark");
	else if (theme === "light") root.classList.add("light");
	else
		root.classList.add(
			window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		);
})();
