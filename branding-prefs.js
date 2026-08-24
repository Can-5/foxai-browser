# Enable userChrome.css
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("toolkit.legacyUserProfileCustomizations.windowIcon", true);
user_pref("toolkit.legacyUserProfileCustomizations.enabled", true);

# Branding overrides (some work in LibreWolf)
user_pref("browser.branding.name", "FoxAI Browser");
user_pref("browser.branding.shortName", "FoxAI");
user_pref("app.branding.name", "FoxAI Browser");
user_pref("app.branding.shortName", "FoxAI");

# LibreWolf specific branding prefs
user_pref("librewolf.branding.name", "FoxAI Browser");
user_pref("librewolf.branding.shortName", "FoxAI");

# Window title
user_pref("browser.titlebar.show", true);