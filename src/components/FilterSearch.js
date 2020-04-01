import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Right,
    Toast,
    Item,
    Input,
    Title,
    CheckBox, Form, Textarea
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {chooseLang} from "../actions";
import COLORS from "../consts/colors";
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import axios from 'axios';
import CONST from "../consts";
import Spinner from "react-native-loading-spinner-overlay";
import {NavigationEvents} from "react-navigation";

const isIOS = Platform.OS === 'ios';

class FilterSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                 : false,
            isModalFilter           : false,
            isModalRate             : false,
            isModalSallery          : false,
            isModalComment          : false,
            active                  : 1,
            count                   : 0,
            projects                : '',
            projects_string         : '',
            totalCases              : '',
            ActiveCases             : '',
            phone                   : null,
            rate                    : i18n.t('rate'),
            rateId                  : null,
            Sallery                 : i18n.t('price'),
            SalleryId               : null,
            checked                 : '',
            checked2                : '',
            cityName                : i18n.translate('mapname'),
            latitude                : this.props.navigation.state.params.latitude,
            longitude               : this.props.navigation.state.params.longitude,
			keyword                 : this.props.navigation.state.params.keyword,
            result                  : [],
        }
    }

    activeInput(type) {

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

    }

    componentWillReceiveProps(nextProps) {

        if( nextProps.navigation.state.params !== undefined ||  nextProps.navigation.state.params  !== undefined){
            this.state.cityName             = nextProps.navigation.state.params.city_name;
            this.setState({latitude   : nextProps.navigation.state.params.latitude});
            this.setState({longitude  : nextProps.navigation.state.params.longitude});
        }else{
            this.setState({cityName  : i18n.translate('mapname')});
        }

        this.setState({ isModalFilter   : !this.state.isModalFilter});

    }

    getLocation(){

        this.props.navigation.navigate('MapLocation', {
            pageName : this.props.navigation.state.routeName
        });

        this.setState({ isModalFilter   : !this.state.isModalFilter});

    }

    onSubCategories ( id ){
        this.setState({spinner: true, active : id });
    }

    toggleModalFilter = () => {
        this.setState({ isModalFilter   : !this.state.isModalFilter});
    };

    toggleModalRate = () => {
        this.setState({ isModalRate     : !this.state.isModalRate});
    };

    toggleModalSallery = () => {
        this.setState({ isModalSallery  : !this.state.isModalSallery});
    };

    selectRateId(id, name) {
        this.setState({
			rateId      : id,
            rate        : name
        });

        this.setState({ isModalRate     : !this.state.isModalRate});
    }

    selectSellaryId(id, name) {
        this.setState({
            SalleryId   : id,
            Sallery     : name
        });
        this.setState({ isModalSallery  : !this.state.isModalSallery});
    }

    onSearch(){
		this.setState({spinner: true});

		const { keyword, phone, SalleryId, rateId, latitude, longitude } = this.state;

		axios({
			method      : 'POST',
			url         : CONST.url + 'search',
			data        : { identity: phone, keyword, rate: rateId, price: SalleryId, distance: null, latitude, longitude },
			headers     : {Authorization: this.props.user.token}
		}).then(response => {
			const data = response.data.data;
			this.setState({ result: response.data.data, spinner: false });
		})
    }

    componentWillMount() {
        this.setState({spinner: true});

        const { keyword, phone, SalleryId, rateId, latitude, longitude } = this.state;

        console.log('keyword__', keyword);

		axios({
			method      : 'POST',
			url         : CONST.url + 'search',
            data        : { identity: phone, keyword, rate: rateId, price: SalleryId, distance: null, latitude, longitude },
			headers     : {Authorization: this.props.user.token}
		}).then(response => {
			const data = response.data.data;
			this.setState({ result: response.data.data, spinner: false, isModalFilter: false });
		})
    }

	onFocus(){
		this.componentWillMount();
	}

    render() {

        return (
            <Container>
				<Spinner visible = { this.state.spinner } />
				<NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            {i18n.translate('providers')}
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.bg_gray, styles.rowGroup, styles.paddingHorizontal_20, styles.paddingVertical_10 ]}>
                        <View style={[styles.position_R, styles.flex_1]}>
                            <Input
                                placeholder={i18n.translate('searchCat')}
                                style={[styles.input, styles.height_40, styles.BorderNone, styles.paddingRight_5, styles.paddingLeft_5 ,styles.textSize_14,styles.text_red, {backgroundColor : "#dcd8d8"}]}
                                autoCapitalize='none'
                                placeholderTextColor='#d8999a'
                                onChangeText={(keyword) => this.setState({keyword})}
                            />
                            <TouchableOpacity
                                style={[styles.position_A, styles.right_0, styles.width_50, styles.height_40, styles.flexCenter]}
                                onPress={() => this.componentWillMount()}>
                                <Image style={[styles.headImage]} source={require('../../assets/img/search.png')} resizeMode={'contain'}/>
                            </TouchableOpacity>
                        </View>
                        <Button style={styles.Button} transparent onPress={() => this.toggleModalFilter()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/controls.png')} resizeMode={'contain'}/>
                        </Button>
                    </View>

                    <View style={[ styles.boxUser ]}>

                        <Modal isVisible={this.state.isModalFilter} onBackdropPress={() => this.toggleModalFilter()} style={[ styles.bottomCenter, styles.Width_100 ]}>
                            <View style={[styles.overHidden, styles.bg_White, styles.flexCenter , styles.Width_100, styles.position_R, styles.top_45 , {height:500 , paddingTop:40}]}>

                                <View style={[styles.paddingVertical_15]}>
                                    <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.textLeft , styles.SelfCenter]}>
                                        {i18n.t('searchchef')}
                                    </Text>
                                </View>

                                <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                                    <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Form style={[styles.Width_90, styles.marginVertical_10, styles.flexCenter]}>

                                        <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                            <Input
                                                placeholder={i18n.translate('numchef')}
                                                style={[styles.input, styles.height_50, (this.state.phoneStatus === 1 ? styles.Active : styles.noActive)]}
                                                onChangeText={(phone) => this.setState({phone})}
                                                onBlur={() => this.unActiveInput('phone')}
                                                onFocus={() => this.activeInput('phone')}
                                                keyboardType={'number-pad'}
                                            />
                                        </Item>

                                        <View style={[styles.overHidden, styles.rowGroup]}>
                                            <TouchableOpacity onPress={() => this.toggleModalRate()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, ( this.state.rateId !== null ? styles.border_red : styles.border_gray )]}>
                                                <Text style={[styles.textRegular, styles.textSize_14, ( this.state.rateId !== null ? styles.text_red : styles.text_black )]}>
                                                    { this.state.rate }
                                                </Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.overHidden, styles.rowGroup]}>
                                            <TouchableOpacity onPress={() => this.toggleModalSallery()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, ( this.state.SalleryId !== null ? styles.border_red : styles.border_gray )]}>
                                                <Text style={[styles.textRegular, styles.textSize_14, ( this.state.SalleryId !== null ? styles.text_red : styles.text_black )]}>
                                                    { this.state.Sallery }
                                                </Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.overHidden, styles.rowGroup]}>
                                            <TouchableOpacity
                                                style       = {[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.latitude !== null ||  this.state.longitude !== null ? styles.border_red : styles.border_gray)]}
                                                onPress     = {() => this.getLocation()}
                                            >
                                                <Text style={[styles.textRegular, styles.textSize_14, styles.width_150, (this.state.latitude !== null ||  this.state.longitude !== null ? styles.text_red : styles.text_black)]} numberOfLines = { 1 } prop with ellipsizeMode = "tail">
                                                    {this.state.cityName}
                                                </Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]} type="Feather" name='map-pin' />
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style       = {[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40]}
                                            onPress     = {() => this.componentWillMount()}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                                {i18n.translate('search')}
                                            </Text>
                                        </TouchableOpacity>

                                    </Form>
                                    </KeyboardAvoidingView>
                                </View>
                            </View>

							<Modal isVisible={this.state.isModalRate} onBackdropPress={() => this.toggleModalRate()}>
								<View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

									<View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
										<Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
											{i18n.t('starrate')}
										</Text>
									</View>

									<View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
										<TouchableOpacity
											style               = {[styles.rowGroup, styles.marginVertical_10]}
											onPress             = {() => this.selectRateId('heigh', i18n.t('topRated'))}
										>
											<View style={[styles.overHidden, styles.rowRight]}>
												<CheckBox
													style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
													color               = {styles.text_red}
													selectedColor       = {styles.text_red}
													onPress             = {() => this.selectRateId('heigh', i18n.t('topRated'))}
													checked             = {this.state.rateId === 'heigh'}
												/>
												<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
													{i18n.t('topRated')}
												</Text>
											</View>
										</TouchableOpacity>

										<TouchableOpacity
											style               = {[styles.rowGroup, styles.marginVertical_10]}
											onPress             = {() => this.selectRateId('low', i18n.t('lowRated'))}
										>
											<View style={[styles.overHidden, styles.rowRight]}>
												<CheckBox
													style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
													color               = {styles.text_red}
													onPress             = {() => this.selectRateId('low', i18n.t('lowRated'))}
													selectedColor       = {styles.text_red}
													checked             = {this.state.rateId === 'low'}
												/>
												<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
													{i18n.t('lowRated')}
												</Text>
											</View>
										</TouchableOpacity>
									</View>

								</View>
							</Modal>

							<Modal isVisible={this.state.isModalSallery} onBackdropPress={() => this.toggleModalSallery()}>
								<View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

									<View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
										<Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
											{i18n.t('price')}
										</Text>
									</View>

									<View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
										<TouchableOpacity
											style               = {[styles.rowGroup, styles.marginVertical_10]}
											onPress             = {() => this.selectSellaryId('heigh', i18n.t('topPrice'))}
										>
											<View style={[styles.overHidden, styles.rowRight]}>
												<CheckBox
													style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
													color               = {styles.text_red}
													selectedColor       = {styles.text_red}
													onPress             = {() => this.selectSellaryId('heigh', i18n.t('topPrice'))}
													checked             = {this.state.SalleryId === 'heigh'}
												/>
												<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
													{i18n.t('topPrice')}
												</Text>
											</View>
										</TouchableOpacity>

										<TouchableOpacity
											style               = {[styles.rowGroup, styles.marginVertical_10]}
											onPress             = {() => this.selectSellaryId('low', i18n.t('lowPrice'))}
										>
											<View style={[styles.overHidden, styles.rowRight]}>
												<CheckBox
													style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
													color               = {styles.text_red}
													selectedColor       = {styles.text_red}
													onPress             = {() => this.selectSellaryId('low', i18n.t('lowPrice'))}
													checked             = {this.state.SalleryId === 'low'}
												/>
												<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
													{i18n.t('lowPrice')}
												</Text>
											</View>
										</TouchableOpacity>
									</View>

								</View>
							</Modal>
                        </Modal>


                        {
                            this.state.result.map((chef, i) => (
								<View style={[ styles.Width_90, styles.flexCenter, { marginTop: 10 }]}>
									<View style={[ styles.marginVertical_10 ]}>
										<Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.Width_100 ]}>
											<View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full ]} />
											<TouchableOpacity onPress     = {() => this.props.navigation.navigate('DetailsChef', { id: chef.id })}>
												<View style={[ styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
													<View style={[ styles.height_70 , styles.flex_25, styles.overHidden, styles.flexCenter, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
														<Image style = {[styles.Width_100 , styles.height_70]} source={{ uri: chef.avatar }}/>
													</View>
													<View style={[ styles.flex_75 ]}>
														<View style={[ styles.rowGroup]}>
															<Text style={[styles.textRegular, styles.text_red, styles.textSize_13, styles.paddingHorizontal_5]}>
                                                                { chef.provider_name }
															</Text>
															<StarRating
																disabled        = {true}
																maxStars        = {5}
																rating          = {chef.rate}
																fullStarColor   = {COLORS.red}
																starSize        = {12}
																starStyle       = {styles.starStyle}
															/>
														</View>
														<View style={[ styles.rowRight]}>
															<Icon style={[styles.textSize_12, styles.text_black_gray, styles.marginHorizontal_5]} type="Feather" name='map-pin' />
															<Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>
                                                                { (chef.address).substr(0, 30) + '...' }
															</Text>
														</View>
													</View>
												</View>
											</TouchableOpacity>
										</Animatable.View>
									</View>
								</View>
                            ))
                        }

                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};
export default connect(mapStateToProps, {})(FilterSearch);
