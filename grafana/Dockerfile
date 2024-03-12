FROM grafana/grafana-oss:10.3.3

USER root

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

## Copy public files
COPY public /usr/share/grafana/public

## Set Grafana options
ENV GF_ENABLE_GZIP=true
ENV GF_USERS_DEFAULT_THEME=light
ENV GF_DEFAULT_INSTANCE_NAME=siasar

## Enable Anonymous Authentication
ENV GF_AUTH_ANONYMOUS_ENABLED=true
ENV GF_AUTH_BASIC_ENABLED=true
ENV GF_USERS_ALLOW_SIGN_UP=false

## Disable Help Section
ENV GF_HELP_ENABLED=false

## Disable Public Dashboards
ENV GF_PUBLIC_DASHBOARDS_ENABLED=false

# Disable Alerting and News
ENV GF_ALERTING_ENABLED=false
ENV GF_UNIFIED_ALERTING_ENABLED=false
ENV GF_NEWS_ENABLED=false

## Enable Panels
ENV GF_PANELS_DISABLE_SANITIZE_HTML=true
ENV GF_PANELS_ENABLE_ALPHA=true

## Disable Updates Check
ENV GF_ANALYTICS_CHECK_FOR_UPDATES=false

## Paths
ENV GF_PATHS_PROVISIONING="/etc/grafana/provisioning"
ENV GF_PATHS_PLUGINS="/var/lib/grafana/plugins"
ENV GF_PATHS_DASHBOARDS="/etc/grafana/dashboards"

## Install plugins
ENV GF_INSTALL_PLUGINS=volkovlabs-echarts-panel,marcusolsson-json-datasource,orchestracities-map-panel,marcusolsson-dynamictext-panel,dalvany-image-panel,volkovlabs-variable-panel

## Copy Provisioning
COPY --chown=grafana:root provisioning $GF_PATHS_PROVISIONING

## Copy Dashboards
COPY --chown=grafana:root dashboards $GF_PATHS_DASHBOARDS

## Set Home Dashboard
ENV GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH=$GF_PATHS_DASHBOARDS/main.json
