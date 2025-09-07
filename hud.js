function AddHud() {
    const baseUrl = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/";

    const hudConfig = {
        icons: {
            cash: baseUrl + "0.png",
            health: baseUrl + "1.png",
            armour: baseUrl + "24.png",
            hunger: baseUrl + "25.png",
            breath: baseUrl + "31.png",
            circle: baseUrl + "0.png",
            zone: baseUrl + "1.png",
            weapon_back: baseUrl + "24.png",
            active_wanted: baseUrl + "25.png",
            inactive_wanted: baseUrl + "31.png",
            wanted_back: baseUrl + "0.png"
        },
        weapon: {
            "24": baseUrl + "24.png",
            "25": baseUrl + "25.png",
            "31": baseUrl + "31.png"
        },
        logo: {
            "1": baseUrl + "0.png"
        }
    };

    function createHud() {
        const hudStyle = document.createElement("link");
        hudStyle.rel = "stylesheet";
        hudStyle.href = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud.css";
        document.head.appendChild(hudStyle);

        const hudElement = document.createElement("div");
        hudElement.id = "OldHudContainer";
        hudElement.innerHTML = `
        <div class="Old-Fixed-Hud">
          <div class="Old-Fixed-HudTop">
            <div class="Old-Fixed-Logo">
              <img src="${hudConfig.logo[1]}">
              <div class="Old-Fixed-Bonus">x3</div>
            </div>
            <div class="Old-Fixed-Main">
              <div class="Old-Fixed-Params">
                <div class="Old-Fixed-Cash">
                  <img src="${hudConfig.icons.cash}">
                  <span>0</span>
                </div>
                <div class="Old-Fixed-Params__all">
                  <div class="Old-Fixed-Param health">
                    <img src="${hudConfig.icons.health}" class="old-param__icon">
                    <div class="Old-Param-Progress">
                      <div class="Old-Progress__Values" style="width:100%">
                        <img src="${hudConfig.icons.circle}" class="circle">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        document.body.appendChild(hudElement);
    }

    if (!document.getElementById("OldHudContainer")) {
        createHud();
    }
}
