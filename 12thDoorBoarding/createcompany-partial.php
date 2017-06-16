<!-- createcompany-partial.html -->
<md-card class="commonContentShell md-whiteframe-1dp" layout="column" ng-switch="createCompanySuccess">
    <section id="formContainer" flex layout="column" layout-align="center center" ng-switch-when="false">
        <section id="containerMainText" layout="column" layout-align="start center">
            <span>Almost there...</span>
            <span>Enter your business information</span>
        </section>
        <form name="createCompanyForm" ng-submit="submitCreateCompanyDetails(createCompanyDetails)" autocomplete="off">
            <md-input-container md-no-float class="md-block" flex>
                <input required id="companyName" type="text" name="companyName" placeholder="Business Name" ng-model="createCompanyDetails.Name">
                <div ng-messages="createCompanyForm.companyName.$error">
                    <div ng-message="required">a valid company name is required.</div>
                </div>
            </md-input-container>
            <div layout="row">
                <md-input-container md-no-float class="md-block" flex="60">
                    <input required id="companyDomain" type="text" name="companyDomain" placeholder="Account URL" ng-model="createCompanyDetails.TenantID" ng-pattern="/^[a-zA-Z0-9]*$/">
                    <div ng-messages="createCompanyForm.companyDomain.$error">
                        <div ng-message="required">a valid company domain name is required.</div>
                        <div ng-message="pattern">your domain name cant have spaces and or special characters.</div>
                    </div>
                </md-input-container>
                <md-input-container md-no-float class="md-block" flex="40">
                    <input disabled id="domainPostfix" type="text" name="companyDomainPostFix" placeholder=".12thDoor.com" ng-model="hostedDomain">
                </md-input-container>
            </div>
            <md-input-container md-no-float class="md-block" flex>
                <md-select required name="companyLocation" placeholder="Country" ng-model="createCompanyDetails.OtherData.CompanyLocation">
                    <md-option ng-repeat="location in companyLocation" ng-value="location.country_name" ng-click="getCurrencyFor(location.country_code)">{{location.country_name}}</md-option>
                </md-select>
                <div class="errors" ng-messages="createCompanyForm.companyLocation.$error" md-auto-hide="true">
                    <div ng-message="required">Please select a company location.</div>
                </div>
            </md-input-container>
            <md-input-container md-no-float class="md-block" flex>
                <md-select required name="currency" placeholder="Currency" ng-model="createCompanyDetails.OtherData.Currency">
                    <md-option ng-repeat="cur in currencies track by $index" ng-value="cur">{{cur}}</md-option>
                </md-select>
                <div class="errors" ng-messages="createCompanyForm.currency.$error" md-auto-hide="true">
                    <div ng-message="required">Please select a currency.</div>
                </div>
            </md-input-container>
            <md-input-container md-no-float class="md-block" flex>
                <md-select required name="businessType" placeholder="Category" ng-model="createCompanyDetails.OtherData.CompanyType" md-on-open="loadBusinessType()">
                    <md-option ng-value="bizType.businessName" ng-repeat="bizType in businessType">{{bizType.businessName}}</md-option>
                </md-select>
                <div class="errors" ng-messages="createCompanyForm.businessType.$error" md-auto-hide="true">
                    <div ng-message="required">Please select a business type.</div>
                </div>
            </md-input-container>
            <div class="md-actions" layout="column" layout-align="center center">
                <md-button class="md-primary" style="border:2px solid; width:250px;" type="submit" ng-disabled="createCompanyForm.$invalid"><span class="loginBtnLabel">Add Business</span></md-button>
            </div>
        </form>
    </section>
    <section id="successContainer" flex layout="column" layout-align="center center" ng-switch-when="true">
        <img src="success.png" style="width:100px; height:100px; opacity:0.2;" />
        <span style="font-size:18px; width:330px; text-align:center; padding:20px 0px 10px 0px;">Your company has been successfully registered to 12thDoor.com</span>
    </section>
</md-card>
