/**
  Apply discourse_login_redirect_plugin when the app boots
**/

import { decorateCooked } from 'discourse/lib/plugin-api';
import ApplicationRoute from 'discourse/routes/application';

export default {
  name: "discourse_login_redirect_plugin",
  initialize: function(container, application) {

    if(Discourse.SiteSettings.d_environment_production){
        Discourse.DLoginPath = Discourse.SiteSettings.d_production_login_redirect_url;
        Discourse.DLogoutPath = Discourse.SiteSettings.d_production_logout_redirect_url;
        Discourse.DCreateAccountPath = Discourse.SiteSettings.d_production_new_account_redirect_url;
    }else{
        //production
        Discourse.DLoginPath =  Discourse.SiteSettings.d_development_login_redirect_url;
        Discourse.DLogoutPath =  Discourse.SiteSettings.d_development_logout_redirect_url;
        Discourse.DCreateAccountPath =  Discourse.SiteSettings.d_development_new_account_redirect_url;
    }

      //Override login functionality with redirect
      ApplicationRoute.reopen({
        actions: {
          showLogin: function() {
               if (this.site.get("isReadOnly")) {
                  bootbox.alert(I18n.t("read_only_mode.login_disabled"));
                } else {

                  if ((Discourse.DLoginPath.length === 0) && !Discourse.SiteSettings.d_login_redirect_active) {
                    this.handleShowLogin();
                  }else{
                    window.location.replace(Discourse.DLoginPath);
                  }
                }
            },
          showCreateAccount: function () {
               if (this.site.get("isReadOnly")) {
                 bootbox.alert(I18n.t("read_only_mode.login_disabled"));
               } else {
                 if ((Discourse.DCreateAccountPath.length === 0) && !Discourse.SiteSettings.d_login_redirect_active) {
                   this.handleShowLogin();
                 }else{
                   window.location.replace(Discourse.DCreateAccountPath);
                 }
               }
            }
          }
      });


      if(Discourse.SiteSettings.d_login_redirect_active){
         //Override custom and default logout redirect
         Discourse.SiteSettings.logout_redirect = Discourse.DLogoutPath;
      }

  }
};
