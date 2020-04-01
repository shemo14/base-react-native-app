import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView} from "react-native";
import {Container, Content, Form, Input, Item, Toast, Icon, CheckBox} from 'native-base'
import styles from '../../assets/style';
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from "react-navigation";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import {connect} from 'react-redux';
import {getDeliveryTypes , getCountries , register , getGenders } from "../actions";
import Spinner from "react-native-loading-spinner-overlay";

let deliveryArr = [];

class Register extends Component {
	constructor(props){
		super(props);
		this.state = {
			name                        : '',
			providerName                : '',
			phone                       : '',
			email                       : '',
			birthday                    : null,
			qualification               : null,
			password                    : '',
			confirmPassword             : '',
			deviceId                    : '',
			date                        : null,
			country                     : i18n.t('choosecity'),
			countryId                   : null,
			nationality                 : i18n.t('enternationality'),
			nationalityId               : null,
			userId                      : null,
			type                        : 0,
			nameStatus                  : 0,
			emailStatus                 : 0,
			phoneStatus                 : 0,
			providerNameStatus          : 0,
			birthdayStatus              : 0,
			qualificationStatus         : 0,
			nationalityStatus           : 0,
			passwordStatus              : 0,
			confirmPasswordStatus       : 0,
			isDatePickerVisible         : false,
			spinner                     : false,
			checkTerms                  : false,
			isModalCountry              : false,
			isModalNationality          : false,
			cityName                    : i18n.translate('mapname'),
			latitude                    : null,
			longitude                   : null,
			userType                    : this.props.navigation.state.params.userType,
			errorType                   : null,
			errorMsg                    : '',
			deliveryArr,
		}
	}

	activeInput(type) {

		if (type === 'name' || this.state.name !== '') {
			this.setState({nameStatus: 1})
		}

		if (type === 'phone' || this.state.phone !== '') {
			this.setState({phoneStatus: 1})
		}

		if (type === 'providerName' || this.state.providerName !== '') {
			this.setState({providerNameStatus: 1})
		}

		if (type === 'email' || this.state.email !== '') {
			this.setState({emailStatus: 1})
		}

		if (type === 'birthday' || this.state.birthday !== '') {
			this.setState({birthdayStatus: 1})
		}

		if (type === 'qualification' || this.state.qualification !== '') {
			this.setState({qualificationStatus: 1})
		}

		if (type === 'nationality' || this.state.nationality !== '') {
			this.setState({nationalityStatus: 1})
		}

		if (type === 'password' || this.state.password !== '') {
			this.setState({passwordStatus: 1})
		}

		if (type === 'confirmPassword' || this.state.confirmPassword !== '') {
			this.setState({confirmPasswordStatus: 1})
		}

	}

	unActiveInput(type) {

		if (type === 'name' && this.state.name === '') {
			this.setState({nameStatus: 0})
		}

		if (type === 'phone' && this.state.phone === '') {
			this.setState({phoneStatus: 0})
		}

		if (type === 'providerName' || this.state.providerName === '') {
			this.setState({providerNameStatus: 0})
		}

		if (type === 'email' || this.state.email === '') {
			this.setState({emailStatus: 0})
		}

		if (type === 'birthday' && this.state.birthday === '') {
			this.setState({birthdayStatus: 0})
		}

		if (type === 'qualification' && this.state.qualification === '') {
			this.setState({qualificationStatus: 0})
		}

		if (type === 'nationality' && this.state.nationality === '') {
			this.setState({nationalityStatus: 0})
		}

		if (type === 'password' && this.state.password === '') {
			this.setState({passwordStatus: 0})
		}

		if (type === 'confirmPassword' && this.state.confirmPassword === '') {
			this.setState({confirmPasswordStatus: 0})
		}

	}

	validate = () => {
		let isError         = false;
		const { userType }  = this.state;
		let msg             = '';

		if (this.state.name.length <= 0) {
			isError     = true;
			msg         = i18n.t('Full');
			this.setState({ errorType: 'name' });
		} else if ((this.state.providerName === '' || this.state.providerName === null) && userType === 'chef' ) {
			isError     = true;
			msg         = i18n.t('providerNameRequired');
			this.setState({ errorType: 'providerName' });
		} else if (this.state.phone.length <= 0) {
			isError     = true;
			msg         = i18n.t('namereq');
			this.setState({ errorType: 'phone' });
		} else if (this.state.email.length <= 0 || this.state.email.indexOf("@") === -1 || this.state.email.indexOf(".") === -1) {
			isError     = true;
			msg         = i18n.t('emailNotCorrect');
			this.setState({ errorType: 'email' });
		} else if ((this.state.date === '' || this.state.date === null) && userType === 'chef' ) {
			isError     = true;
			msg         = i18n.t('enterbirthday');
			this.setState({ errorType: 'date' });
		} else if ((this.state.qualification === null || this.state.qualification == '')  && userType === 'chef' ) {
			isError     = true;
			msg         = i18n.t('enterqualification');
			this.setState({ errorType: 'qualification' });
		} else if (this.state.nationalityId === null) {
			isError     = true;
			msg         = i18n.t('enternationality');
			this.setState({ errorType: 'nationality' });
		}else if (this.state.countryId === null){
			isError     = true;
			msg         = i18n.translate('choosecity');
			this.setState({ errorType: 'city' });
		} else if (this.state.password.length < 6){
			isError     = true;
			msg         = i18n.translate('passreq');
			this.setState({ errorType: 'password' });
		} else if (this.state.password !== this.state.confirmPassword){
			isError     = true;
			msg         = i18n.translate('notmatch');
			this.setState({ errorType: 'password' });
		} else if (this.state.checked === false) {
			isError = true;
			msg     = i18n.translate('aggreTerms');
		}

		if (msg !== '') {
			Toast.show({
				text        : msg,
				type        : "danger",
				duration    : 3000,
				textStyle       : {
					color       : "white",
					fontFamily  : 'cairo',
					textAlign   : 'center',
				}
			});
		}

		this.setState({ errorMsg: msg });

		return isError;
	};

	onRegister() {
		const err = this.validate();

		if (!err){
			this.setState({ spinner: true });
			const userType = this.props.navigation.state.params.userType;
			const { name, phone, email, providerName, qualification, password, date, deliveryArr, countryId, nationalityId, cityName, latitude, longitude } = this.state;
			const data = { name, phone, email,  providerName, qualification, password, deliveryArr, date, cityName, countryId, nationalityId, userType, latitude, longitude, lang: this.props.lang };
			this.props.register(data, this.props);
		}
	}

	onDeliveryTypeChecked (id){
		if (deliveryArr.includes(id)){
			let index = deliveryArr.indexOf(id);
			deliveryArr.splice(index, 1);
			this.setState({ deliveryArr });
		} else {
			deliveryArr.push(id);
			this.setState({ deliveryArr });
		}
	}

	toggleDatePicker = () => {
		this.setState({ isDatePickerVisible: !this.state.isDatePickerVisible });
	};

	doneDatePicker = date => {
		let formatted_date = date.getFullYear() + "-" + ("0"+(date.getMonth() + 1)).slice(-2) + "-" + ("0" +date.getDate()).slice(-2);
		this.setState({ date : formatted_date, isDatePickerVisible: false });
	};

	toggleModalCountry = () => {
		this.setState({ isModalCountry: !this.state.isModalCountry});
	};

	selectCountryId(id, name) {
		this.setState({
			countryId    : id,
			country      : name
		});

		this.setState({ isModalCountry: !this.state.isModalCountry});
	}

	toggleModalNationality = () => {
		this.setState({ isModalNationality: !this.state.isModalNationality});
	};

	selectNationalityId(id, name) {
		this.setState({
			nationalityId       : id,
			nationality         : name
		});

		this.setState({ isModalNationality: !this.state.isModalNationality});
	}

	componentWillMount() {
		this.props.getDeliveryTypes(this.props.lang);
		this.props.getCountries(this.props.lang);
		this.props.getGenders(this.props.lang);
	}

	getLocation(){
		this.props.navigation.navigate('MapLocation', {
			pageName : this.props.navigation.state.routeName
		});

	}

	componentWillReceiveProps(nextProps) {


		this.setState({ spinner: false });
		if( nextProps.navigation.state.params !== undefined ||  nextProps.navigation.state.params  !== undefined){
			this.state.cityName             = nextProps.navigation.state.params.city_name;
			this.setState({latitude   : nextProps.navigation.state.params.latitude});
			this.setState({longitude  : nextProps.navigation.state.params.longitude});
		}else{
			this.setState({cityName   : i18n.translate('mapname')});
		}

		this.setState({ isModalFilter   : !this.state.isModalFilter});

	}

	onFocus(){
		this.componentWillMount();
	}

	render() {
		const userType = this.props.navigation.state.params.userType;

		return (

			<Container>
				{/*<Spinner visible={this.state.spinner} />*/}

				<NavigationEvents onWillFocus={() => this.onFocus()} />

				<Content contentContainerStyle={styles.bgFullWidth}>
					<View style={[styles.position_R, styles.bgFullWidth, styles.marginVertical_15, styles.flexCenter, styles.Width_100]}>
						<View style={[styles.overHidden, styles.marginVertical_15]}>
							<Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
								<Image style={[styles.icoImage]} source={require('../../assets/img/icon.png')}/>
							</Animatable.View>
						</View>
						<KeyboardAvoidingView behavior={'padding'}>
							<Form style={[styles.flexCenter, styles.marginVertical_25, styles.Width_90]}>

								<View style={[styles.position_R, styles.height_80, styles.flexCenter]}>
									<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden ]}>
										<Input
											placeholder={i18n.translate('userName')}
											style={[styles.input, styles.height_50, (this.state.nameStatus === 1 || this.state.errorType === 'name' ? styles.Active : styles.noActive)]}
											onChangeText={(name) => this.setState({name})}
											onBlur={() => this.unActiveInput('name')}
											onFocus={() => this.activeInput('name')}
										/>
									</Item>
									{ this.state.errorType === 'name' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
								</View>

								{
									userType == 'chef' ?
										<View style={[styles.position_R, styles.height_80, styles.flexCenter]}>
											<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden ]}>
												<Input
													placeholder={i18n.translate('providerName')}
													style={[styles.input, styles.height_50, (this.state.providerNameStatus === 1 || this.state.errorType === 'providerName' ? styles.Active : styles.noActive)]}
													onChangeText={(providerName) => this.setState({providerName})}
													onBlur={() => this.unActiveInput('providerName')}
													onFocus={() => this.activeInput('providerName')}
												/>
											</Item>
											{ this.state.errorType === 'name' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
										</View> : null
								}

								<View style={[styles.position_R, styles.height_70, styles.flexCenter]}>
									<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
										<Input
											placeholder={i18n.translate('phone')}
											style={[styles.input, styles.height_50, (this.state.phoneStatus === 1 || this.state.errorType === 'phone' ? styles.Active : styles.noActive)]}
											onChangeText={(phone) => this.setState({phone})}
											onBlur={() => this.unActiveInput('phone')}
											onFocus={() => this.activeInput('phone')}
											keyboardType={'number-pad'}
										/>
									</Item>
									{ this.state.errorType === 'phone' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
								</View>

								<View style={[styles.position_R, styles.height_80, styles.flexCenter]}>
									<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden ]}>
										<Input
											placeholder={i18n.translate('email')}
											style={[styles.input, styles.height_50, (this.state.emailStatus === 1 || this.state.errorType === 'email' ? styles.Active : styles.noActive)]}
											onChangeText={(email) => this.setState({email})}
											onBlur={() => this.unActiveInput('email')}
											onFocus={() => this.activeInput('email')}
										/>
									</Item>
									{ this.state.errorType === 'email' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
								</View>

								{
									this.state.userType === 'chef' ?
										<View style={[styles.overHidden, styles.rowGroup]}>
											<TouchableOpacity onPress={this.toggleDatePicker} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.date !== '' ? styles.border_red :  styles.border_gray )]}>
												<Text style={[styles.textRegular, styles.textSize_14, (this.state.date !== '' || this.state.errorType === 'date' ? styles.text_red :  styles.text_black )]}>
													{i18n.translate('birthday')} : {this.state.date}
												</Text>
												<Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='calendar' />
											</TouchableOpacity>

											<DateTimePicker
												isVisible       = {this.state.isDatePickerVisible}
												onConfirm       = {this.doneDatePicker}
												onCancel        = {this.toggleDatePicker}
												mode            = {'date'}
                                                // minimumDate     = {new Date()}
											/>
										</View> : null
								}

								<View style={[styles.overHidden, styles.rowGroup]}>
									<TouchableOpacity onPress={() => this.toggleModalNationality()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.nationalityId !== null || this.state.errorType === 'nationality' ? styles.border_red :  styles.border_gray )]}>
										<Text style={[styles.textRegular, styles.textSize_14, (this.state.nationalityId !== null ? styles.text_red :  styles.text_black )]}>
											{ this.state.nationality }
										</Text>
										<Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
									</TouchableOpacity>
									{ this.state.errorType === 'nationality' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
								</View>

								<Modal isVisible={this.state.isModalNationality} onBackdropPress={() => this.toggleModalNationality()}>
									<View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

										<View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
											<Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
												{i18n.t('enternationality')}
											</Text>
										</View>

										<View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
											{
												this.props.genders.map((gender, i ) => {
													return(
														<TouchableOpacity
															style               = {[styles.rowGroup, styles.marginVertical_10]}
															onPress             = {() => this.selectNationalityId(gender.id, gender.name)}
														>
															<View style={[styles.overHidden, styles.rowRight]}>
																<CheckBox
																	style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
																	color               = {styles.text_red}
																	selectedColor       = {styles.text_red}
																	checked             = {this.state.checked === 1}
																	onPress             = {() => this.selectNationalityId(gender.id, gender.name)}
																/>
																<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
																	{gender.name}
																</Text>
															</View>
														</TouchableOpacity>

													)
												})
											}
										</View>

									</View>
								</Modal>

								<View style={[styles.overHidden, styles.rowGroup]}>
									<TouchableOpacity onPress={() => this.toggleModalCountry()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border,  (this.state.countryId !== null || this.state.errorType === 'city' ? styles.border_red :  styles.border_gray )]}>
										<Text style={[styles.textRegular, styles.textSize_14, (this.state.countryId !== null  ? styles.text_red :  styles.text_black )]}>
											{ this.state.country }
										</Text>
										<Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
									</TouchableOpacity>
									{ this.state.errorType === 'city' ? <Text style={{ color: 'red', height: 20, textAlign: 'center' }}>{ this.state.errorMsg }</Text> : null }
								</View>

								<Modal isVisible={this.state.isModalCountry} onBackdropPress={() => this.toggleModalCountry()}>
									<View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

										<View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
											<Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
												{i18n.t('choosecity')}
											</Text>
										</View>

										<View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
											{
												this.props.countries.map((country, i ) => {
													return(
														<TouchableOpacity
															style               = {[styles.rowGroup, styles.marginVertical_10]}
															onPress             = {() => this.selectCountryId(country.id, country.name)}
														>
															<View style={[styles.overHidden, styles.rowRight]}>
																<CheckBox
																	style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
																	color               = {styles.text_red}
																	selectedColor       = {styles.text_red}
																	checked             = {this.state.checked2 === country.id}
																	onPress             = {() => this.selectCountryId(country.id, country.name)}
																/>
																<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
																	{country.name}
																</Text>
															</View>
														</TouchableOpacity>

													)
												})
											}
										</View>

									</View>
								</Modal>

								{
									this.state.userType === 'chef' ?
										<View style={[styles.position_R, styles.height_70, styles.flexCenter]}>
											<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
												<Input
													placeholder={i18n.translate('qualification')}
													style={[styles.input, styles.height_50, (this.state.qualificationStatus === 1 || this.state.errorType === 'qualification' ? styles.Active : styles.noActive)]}
													onChangeText={(qualification) => this.setState({qualification})}
													onBlur={()  => this.unActiveInput('qualification')}
													onFocus={() => this.activeInput('qualification')}
												/>
											</Item>
											{ this.state.errorType === 'qualification' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
										</View> : null
								}

								<View style={[styles.overHidden, styles.rowGroup]}>
									<TouchableOpacity
										style       = {[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.latitude !== null || this.state.longitude !== null ? styles.border_red : styles.border_gray)]}
										onPress     = {() => this.getLocation()}
									>
										<Text style={[styles.textRegular, styles.textSize_14, styles.width_150, (this.state.latitude !== null ||  this.state.longitude !== null ? styles.text_red : styles.text_black)]} numberOfLines = { 1 } prop with ellipsizeMode = "tail">
											{this.state.cityName}
										</Text>
										<Icon style={[styles.textSize_20, styles.text_light_gray]} type="Feather" name='map-pin' />
									</TouchableOpacity>
								</View>

								<View style={[styles.position_R, styles.height_70, styles.flexCenter]}>
									<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
										<Input
											placeholder={i18n.translate('password')}
											style={[styles.input, styles.height_50, (this.state.passwordStatus === 1 || this.state.errorType === 'password'  ? styles.Active : styles.noActive)]}
											onChangeText={(password) => this.setState({password})}
											onBlur={() => this.unActiveInput('password')}
											onFocus={() => this.activeInput('password')}
											secureTextEntry
										/>
									</Item>
									{ this.state.errorType === 'password' ? <Text style={{ color: 'red', height: 40 }}>{ this.state.errorMsg }</Text> : null }
								</View>

								<View
									style={[styles.position_R, styles.height_70, styles.flexCenter]}>
									<Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
										<Input
											placeholder={i18n.translate('confirmPassword')}
											style={[styles.input, styles.height_50, (this.state.confirmPasswordStatus === 1 || this.state.errorType === 'password'? styles.Active : styles.noActive)]}
											onChangeText={(confirmPassword) => this.setState({confirmPassword})}
											onBlur={()  => this.unActiveInput('confirmPassword')}
											onFocus={() => this.activeInput('confirmPassword')}
											secureTextEntry
										/>
									</Item>
								</View>

								{
									this.state.userType === 'chef' ?
										<View style={[ styles.height_40 ]}>
											<ScrollView style={[ styles.scroll ]} horizontal={true} showsHorizontalScrollIndicator={false}>

												{
													this.props.deliveryTypes.map((type, i ) => {
														return(
															<TouchableOpacity key={i}
																onPress         = {() => this.onDeliveryTypeChecked(type.id)}
																style           = {[ styles.paddingHorizontal_25, styles.paddingVertical_5, styles.flexCenter, styles.marginVertical_5, styles.marginHorizontal_5, ( this.state.deliveryArr.includes(type.id) ? styles.bg_black : styles.bg_gray ) ]}>
																<Text style     = {[ styles.textRegular, styles.textSize_12 , ( this.state.deliveryArr.includes(type.id) ? styles.text_White : styles.text_black_gray )]} >
																	{type.name}
																</Text>
															</TouchableOpacity>
														)
													})
												}

											</ScrollView>
										</View> : null
								}

								<View style={[styles.rowCenter, styles.marginVertical_20]}>
									<TouchableOpacity style={[styles.rowRight, styles.marginVertical_10]}>
										<CheckBox
											style={[styles.checkBox, styles.Border, styles.bg_red, styles.Border, styles.border_red]}
											color={styles.text_gray}
											selectedColor={styles.text_White}
											onPress={() => this.setState({checkTerms: !this.state.checkTerms})}
											checked={this.state.checkTerms}
										/>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.props.navigation.navigate('Terms')}>
										<Text
											style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.paddingHorizontal_15, styles.textDecoration]}>
											{i18n.t('agreTe')}
										</Text>
									</TouchableOpacity>
								</View>

								<TouchableOpacity
									style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40]}
									onPress={() => this.onRegister()}>
									<Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
										{i18n.translate('doHaveAcc')}
									</Text>
								</TouchableOpacity>

							</Form>
						</KeyboardAvoidingView>
						<TouchableOpacity
							onPress         = {() => this.props.navigation.navigate('Login')}
							style           = {[styles.marginVertical_10, styles.flexCenter, styles.zIndex]}>
							<Text style     = {[styles.textRegular, styles.textSize_14, styles.text_red]}>
								{i18n.translate('login')}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.shape_logo, styles.position_A, styles.fixItem, styles.zIndexDown]}>
						<Animatable.View animation="fadeIn" easing="ease-out" delay={500}>
							<Image style={[styles.shape_logo]} source={require('../../assets/img/shape.png')}/>
						</Animatable.View>
					</View>
				</Content>

			</Container>

		);
	}
}

const mapStateToProps = ({ auth, profile, lang , deliveryTypes , countries , genders}) => {
	return {
		loading         : auth.loading,
		auth            : auth.user,
		userRegister    : auth.message,
		user            : profile.user,
		lang            : lang.lang,
		deliveryTypes   : deliveryTypes.deliveryTypes,
		countries       : countries.countries,
		genders         : genders.genders,
	};
};
export default connect(mapStateToProps, { getDeliveryTypes , getCountries , getGenders, register })(Register);
