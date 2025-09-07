function AddHud() {
    window.bayok = window.bayok || {};

    // Функція для форматування чисел
    function formatNumberWithDots(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const hudScript = document.currentScript;
    const hudElements = [];

    // URL до GitHub-репозиторію з ресурсами
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
        },
        style: {
            "authorization": "body .authorization{background:0 0;}#app .authorization{background-image:url()}"
        }
    };

    // Використовуємо config для створення HUD
    function createHud() {
        const hudStyleElement = document.createElement("link");
        hudStyleElement.rel = "stylesheet";
        hudStyleElement.href = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud.css";
        document.head.appendChild(hudStyleElement);

        const hudElement = document.createElement("div");
        hudElement.id = 'OldHudContainer';
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
                    <span class="Old-Param-Values">100</span>
                  </div>
                  <div class="Old-Fixed-Param armour">
                    <img src="${hudConfig.icons.armour}" class="old-param__icon">
                    <div class="Old-Param-Progress">
                      <div class="Old-Progress__Values" style="width:100%">
                        <img src="${hudConfig.icons.circle}" class="circle">
                      </div>
                    </div>
                    <span class="Old-Param-Values">100</span>
                  </div>
                  <div class="Old-Fixed-Param hunger">
                    <img src="${hudConfig.icons.hunger}" class="old-param__icon">
                    <div class="Old-Param-Progress">
                      <div class="Old-Progress__Values" style="width:100%">
                        <img src="${hudConfig.icons.circle}" class="circle">
                      </div>
                    </div>
                    <span class="Old-Param-Values">100</span>
                  </div>
                  <div class="Old-Fixed-Param breath">
                    <img src="${hudConfig.icons.breath}" class="old-param__icon">
                    <div class="Old-Param-Progress">
                      <div class="Old-Progress__Values" style="width:100%">
                        <img src="${hudConfig.icons.circle}" class="circle">
                      </div>
                    </div>
                    <span class="Old-Param-Values">100</span>
                  </div>
                </div>
              </div>
              <div class="Old-Fixed-Weapon">
                <img src="${hudConfig.icons.weapon_back}" class="Old-Fixed-Weapon_back"> 
                <img src="${hudConfig.weapon[24]}" class="Old-Fixed-Weapon_icon">
                <div class="Old-Fixed-Weapon_ammo">
                  <span class="Ammo-in-clip">30</span>
                  <span class="Ammo-full">/120</span>
                </div>
              </div>
            </div>
            <div class="Old-Fixed-Wanted">
              <img src="${hudConfig.icons.wanted_back}" class="Old-Fixed-Wanted_back">
              <div class="Wanted_row">
                <img src="${hudConfig.icons.inactive_wanted}">
                <img src="${hudConfig.icons.inactive_wanted}">
                <img src="${hudConfig.icons.inactive_wanted}">
                <img src="${hudConfig.icons.active_wanted}">
                <img src="${hudConfig.icons.active_wanted}">
              </div>
            </div>
          </div>
        </div>`;
        document.body.appendChild(hudElement);
        hudElements.push(hudElement);
    }

    createHud();
}
AddHud();
