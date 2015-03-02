/**
  Apply discourse_login_redirect_plugin when the app boots
**/

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

                  if (Discourse.DLoginPath.length === 0) {
                    this.handleShowLogin();
                  }else{

                    var login_redirect_path = Discourse.DLoginPath + "?dialog=" +  JSON.stringify({ Name: "Login", Arguments: { Redirect: window.location.protocol + "//" + window.location.hostname } });
                    window.location.replace(login_redirect_path);
                  }
                }
            },
          showCreateAccount: function () {
               if (this.site.get("isReadOnly")) {
                 bootbox.alert(I18n.t("read_only_mode.login_disabled"));
               } else {
                 if (Discourse.DCreateAccountPath.length === 0)  {
                   console.log("here");
                   this.handleShowCreateAccount();
                 }else{
                   window.location.replace(Discourse.DCreateAccountPath);
                 }
               }
            }
          }
      });



      Discourse.logout = function (){
        Discourse.User.logout().then(function (){
          // Reloading will refresh unbound properties
            Discourse.KeyValueStore.abandonLocal();
            //Override custom and default logout redirect

            if(Discourse.DLogoutPath.length === 0 ){
              var redirect = Discourse.SiteSettings.logout_redirect;
            }else{
              document.cookie = '_t=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              var redirect = Discourse.DLogoutPath;
            }

            if(redirect.length === 0){
              window.location.pathname = Discourse.getURL('/');
            } else {
              window.location.href = redirect;
            }
        });
      };


  }
};
