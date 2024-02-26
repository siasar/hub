FROM grafana/grafana-oss:10.3.3

USER root

## Replace Favicon and Apple Touch
COPY img/fav32.png /usr/share/grafana/public/img
COPY img/fav32.png /usr/share/grafana/public/img/apple-touch-icon.png

## Replace Logo
COPY img/logo.svg /usr/share/grafana/public/img/grafana_icon.svg

## Update Background
# COPY img/background.svg /usr/share/grafana/public/img/g8_login_dark.svg
# COPY img/background.svg /usr/share/grafana/public/img/g8_login_light.svg

## Install fonts
RUN apk add --no-cache fontconfig
COPY fonts /usr/share/fonts/
RUN fc-cache -fv

# Update Title
RUN sed -i 's|<title>\[\[.AppTitle\]\]</title>|<title>SIASAR Hub</title>|g' /usr/share/grafana/public/views/index.html

## Update Help menu
RUN sed -i "s|\[\[.NavTree\]\],|nav,|g; \
    s|window.grafanaBootData = {| \
    let nav = [[.NavTree]]; \
    const alerting = nav.find((element) => element.id === 'alerting'); \
    if (alerting) { alerting['url'] = '/alerting/list'; } \
    const dashboards = nav.find((element) => element.id === 'dashboards/browse'); \
    if (dashboards) { dashboards['children'] = [];} \
    const connections = nav.find((element) => element.id === 'connections'); \
    if (connections) { connections['url'] = '/datasources'; connections['children'].shift(); } \
    const help = nav.find((element) => element.id === 'help'); \
    if (help) { help['subTitle'] = 'Grafana OSS'; help['children'] = [];} \
    window.grafanaBootData = {|g" \
  /usr/share/grafana/public/views/index.html

## Update Title
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|AppTitle="Grafana"|AppTitle="SIASAR Hub"|g' {} \;

## Update Login Title
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|LoginTitle="Welcome to Grafana"|LoginTitle="Welcome to SIASAR Hub"|g' {} \;

## Remove Documentation, Support, Community in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|\[{target:"_blank",id:"documentation".*grafana_footer"}\]|\[\]|g' {} \;

## Remove Edition in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|({target:"_blank",id:"license",.*licenseUrl})|()|g' {} \;

## Remove Version in the Footer
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|({target:"_blank",id:"version",.*CHANGELOG.md":void 0})|()|g' {} \;

## Remove News icon
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|..createElement(....,{className:.,onClick:.,iconOnly:!0,icon:"rss","aria-label":"News"})|null|g' {} \;

## Remove Open Source icon
RUN find /usr/share/grafana/public/build/ -name *.js -exec sed -i 's|.push({target:"_blank",id:"version",text:`${..edition}${.}`,url:..licenseUrl,icon:"external-link-alt"})||g' {} \;

## Set Grafana options
ENV GF_ENABLE_GZIP=true
ENV GF_USERS_DEFAULT_THEME=light

## Enable Anonymous Authentication
ENV GF_AUTH_ANONYMOUS_ENABLED=true
ENV GF_AUTH_BASIC_ENABLED=false
ENV GF_USERS_ALLOW_SIGN_UP=false

## Disable Sanitize
ENV GF_PANELS_DISABLE_SANITIZE_HTML=true

## Disable Explore
ENV GF_EXPLORE_ENABLED=true

# Updates Check
ENV GF_ANALYTICS_CHECK_FOR_UPDATES=false

## Paths
ENV GF_PATHS_PROVISIONING="/etc/grafana/provisioning"
ENV GF_PATHS_PLUGINS="/var/lib/grafana/plugins"
ENV GF_PATHS_DASHBOARDS="/etc/grafana/dashboards"

## Install plugins
ENV GF_INSTALL_PLUGINS=volkovlabs-echarts-panel,marcusolsson-json-datasource,orchestracities-map-panel

## Copy Provisioning
COPY --chown=grafana:root provisioning $GF_PATHS_PROVISIONING

## Copy Dashboards
COPY --chown=grafana:root provisioning/dashboards/*.json $GF_PATHS_DASHBOARDS/

## Set Home Dashboard
ENV GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH=$GF_PATHS_DASHBOARDS/main.json
