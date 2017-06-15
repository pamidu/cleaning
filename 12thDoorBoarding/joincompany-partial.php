<!-- joincompany-partial.html -->
<md-card class="commonContentShell md-whiteframe-1dp" layout="column" ng-switch="joinCompanySuccess">
	<section id="formContainer" flex layout="column" layout-align="center center" ng-switch-when="false">
		<section id="containerMainText" layout="column" layout-align="start center">
            <span>Join Business</span>
        </section>
		<form name="joinCompanyForm" ng-submit="submitJoinCompanyDetails(joinCompanyDetails)" autocomplete="off">
			<div layout="row">
				<md-input-container md-no-float class="md-block" flex="70">
					<input required id="accounturl" type="text" name="accounturl" placeholder="Account URL" ng-model="joinCompanyDetails.CompanyDomain">
					<div ng-messages="joinCompanyForm.accounturl.$error">
						<div ng-message="required">a valid account URL is required.</div>
					</div>
				</md-input-container>
				<md-input-container md-no-float class="md-block" flex="30">
					<input disabled id="domainPostfix" type="text" name="companyDomainPostFix" placeholder=".12thDoor.com">
				</md-input-container>
			</div>				
			<div class="md-actions" layout="column" layout-align="center center" style="margin-top:16px; margin-bottom:32px;">
				<md-button class="md-primary" style="border:2px solid; width:250px" type="submit" ng-disabled="joinCompanyForm.$invalid"><span class="loginBtnLabel">Request an Invite</span></md-button>
			</div>
		</form>
		<div class="socialActions" layout="column" layout-align="center center">
			<span style="text-align:center; font-weight:500; ">Please enter the account URL of the business you wish to join. You will recive a notification via email once your request has been accepted by the business owner.<span>
			</div>
		</section>
		<section id="successContainer" layout="column" layout-align="center center" ng-switch-when="true">
			<img src="success.png" style="width:100px; height:100px; opacity:0.2;"/>
			<span style="font-size:18px; width:330px; text-align:center; padding:20px 0px 10px 0px;">Your invitation is succefully processed, please wait for administrator confirmaton.</span>
		</section>
	</md-card>