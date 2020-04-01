import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, FlatList,} from "react-native";
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
    Input,
    Title, Form, Item, CheckBox,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import * as Animatable from 'react-native-animatable';
import StarRating from "react-native-star-rating";
import COLORS from "../consts/colors";
import Modal from "react-native-modal";
import axios from 'axios';
import CONST from "../consts";
import Spinner from "react-native-loading-spinner-overlay";
import {NavigationEvents} from "react-navigation";
import Product from './Product'

class DetailsChef extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                     : false,
            isModalInfo                 : false,
            isModalFilter               : false,
            category                    : i18n.t('chooseCategory'),
            categoryId                  : null,
            provider                    : [],
            categories                  : [],
            meals                       : []
        }
    }

    toggleModalInfo = () => {
        this.setState({ isModalInfo   : !this.state.isModalInfo});
    };

    toggleModalFilter = () => {
        this.setState({ isModalFilter   : !this.state.isModalFilter});
    };

    selectCategoryId(categoryId, name) {
        this.setState({
            checked         : categoryId,
            categoryId      : categoryId,
            category        : name,
			spinner         : true
        });

		let { id } = this.props.navigation.state.params;

		axios({
			method      : 'POST',
			url         : CONST.url + 'meals',
			data        : { provider_id: id, category_id: categoryId },
			headers     : {Authorization: this.props.user.token}
		}).then(response => {
			this.setState({ meals: response.data.data, spinner: false });
		});

        this.state.categoryId = id;
        this.setState({ isModalFilter   : !this.state.isModalFilter});
    }

    componentWillMount() {
        this.setState({spinner: true});

        let { id } = this.props.navigation.state.params;

		axios({
			method      : 'POST',
			url         : CONST.url + 'provider-info',
			data        : { id },
			headers     : {Authorization: this.props.user.token}
		}).then(response => {
			this.setState({ provider: response.data.data, categories: response.data.data.categories , spinner: false });
		});

		axios({
			method      : 'POST',
			url         : CONST.url + 'meals',
			data        : { provider_id: id },
			headers     : {Authorization: this.props.user.token}
		}).then(response => {
			this.setState({ meals: response.data.data, spinner: false });
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
							{ this.state.provider.provider_name }
                        </Title>
                    </Body>
                    <Right style={styles.rightIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.toggleModalInfo()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/info.png')} resizeMode={'contain'}/>
                        </Button>
                    </Right>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <Modal isVisible={this.state.isModalInfo} onBackdropPress={() => this.toggleModalInfo()} style={[ styles.bottomCenter, styles.Width_100 ]}>
                        <View style={[styles.overHidden, styles.bg_White , styles.Width_100, styles.position_R, styles.top_20]}>

                            <View style={[styles.paddingVertical_15]}>
                                <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.textCenter , styles.SelfCenter]}>
                                    {i18n.t('datapro')}
                                </Text>
                            </View>

                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                <View style={[ styles.marginVertical_10 ]}>
                                    <View style={[ styles.rowRight, styles.marginVertical_5]}>
                                        <Icon style={[styles.textSize_13, styles.text_black_gray, styles.marginHorizontal_5]} type="Feather" name='map-pin' />
                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>
                                            { this.state.provider.address }
                                        </Text>
                                    </View>
                                    <View style={[ styles.rowRight, styles.paddingHorizontal_10, styles.marginVertical_5 ]}>
                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>{i18n.t('delver')} : </Text>
                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>24 كم</Text>
                                    </View>
                                    <View style={[ styles.rowRight, styles.paddingHorizontal_10, styles.marginVertical_5 ]}>
                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>{i18n.t('timedelver')} : </Text>
                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>استلام من الشيف / علي حسب المسافه</Text>
                                    </View>
                                </View>

                            </View>

                        </View>
                    </Modal>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_80, styles.right_0, styles.top_0 ]}/>

                    <View style={[ styles.marginVertical_10, styles.overHidden ]}>
                        <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[ styles.Width_100 ]}>
                                <View style={[ styles.rowGroup, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                    <View style={[ styles.height_80 , styles.flex_25, styles.overHidden, styles.flexCenter, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                        <Image style = {[styles.Width_100 , styles.height_80, styles.Border, styles.border_White]} source={{ uri: this.state.provider.avatar }}/>
                                    </View>
                                    <View style={[ styles.flex_75 ]}>
                                        <View style={[ styles.rowRight]}>
                                            <Icon
                                                style   = {[styles.text_green, styles.textSize_5, styles.marginHorizontal_5]}
                                                type    = "FontAwesome"
                                                name    = 'circle'
                                            />
                                            <Text style={[styles.textBold, styles.text_black, styles.textSize_13]}>
                                                { this.state.provider.provider_name }
                                            </Text>
                                        </View>
                                        <Text style={[styles.textBold, styles.text_black, styles.textSize_12, styles.rowRight]}>
											#{ this.state.provider.identifier }
                                        </Text>
                                        <View style={[styles.rowRight, styles.marginVertical_5]}>
                                            <StarRating
                                                disabled        = {true}
                                                maxStars        = {5}
                                                rating          = {this.state.provider.rate}
                                                fullStarColor   = {COLORS.red}
                                                starSize        = {12}
                                                starStyle       = {styles.starStyle}
                                            />
                                        </View>
                                        <View style={[ styles.rowRight]}>
                                            <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_10]}>
                                                { this.state.provider.provider_details }
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                        </Animatable.View>
                    </View>

                    <View style={[styles.overHidden, styles.rowGroup]}>
                        <TouchableOpacity onPress={() => this.toggleModalFilter()} style={[ styles.marginVertical_5 , styles.marginHorizontal_15 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_red]}>
                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                { this.state.category }
                            </Text>
                            <Icon style={[styles.textSize_14, styles.text_White]} type="AntDesign" name='down' />
                        </TouchableOpacity>
                    </View>

                    <Modal isVisible={this.state.isModalFilter} onBackdropPress={() => this.toggleModalFilter()} style={[ styles.bottomCenter, styles.Width_100 ]}>
                        <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20]}>

                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                                {
                                    this.state.categories.map((category, i) => (
										<TouchableOpacity key={i}
											style               = {[styles.rowGroup, styles.marginVertical_10]}
											onPress             = {() => this.selectCategoryId(category.id , category.name)}
										>
											<View style={[styles.overHidden, styles.rowRight]}>
												<CheckBox
													onPress             = {() => this.selectCategoryId(category.id , category.name)}
													style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
													color               = {styles.text_red}
													selectedColor       = {styles.text_red}
													checked             = {this.state.checked === category.id}
												/>
												<Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                    { category.name }
												</Text>
											</View>
										</TouchableOpacity>
                                    ))
                                }
                            </View>

                        </View>
                    </Modal>

                    <View style={[ styles.marginVertical_10 ]}>

                        <View style={[ styles.rowGroup, styles.paddingHorizontal_10, styles.marginVertical_10, styles.overHidden, styles.Width_100 ]}>
                            {
                                this.state.meals.map(( meal, i ) => (
									<Product key={meal.id} data={meal} navigation={this.props.navigation} />
                                ))
                            }

                        </View>


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
export default connect(mapStateToProps, {})(DetailsChef);
