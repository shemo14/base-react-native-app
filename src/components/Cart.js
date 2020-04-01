import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    KeyboardAvoidingView,
    ActivityIndicator
} from "react-native";
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
import {getCarts} from "../actions";
import COLORS from "../consts/colors";
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import {NavigationEvents} from "react-navigation";

const isIOS = Platform.OS === 'ios';

class Cart extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader: true
        }
    }

    componentWillMount() {
        this.setState({loader: true});
        this.props.getCarts(this.props.lang , this.props.user.token)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({loader: false});
    }

    renderLoader(){
        if (this.state.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    renderNoData() {
        if (this.props.carts && (this.props.carts).length <= 0) {
            return (
                <View style={[styles.flexColumnCenter , styles.Width_100 , {height:'95%'}]}>
                    <Image source={require('../../assets/img/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return <View/>
    }


    onFocus() {
        this.componentWillMount();
    }
    render() {

        return (
            <Container>
                { this.renderLoader() }
                <NavigationEvents onWillFocus={() => this.onFocus()}/>
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('basket') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, { top : -30 } ]}>

                        <View style={[ styles.Width_90, styles.flexCenter, styles.marginVertical_30 ]}>
                            {this.renderNoData()}
                            {
                                this.props.carts?
                                    this.props.carts.map((cart, i) => (
                                        <View key={i} style={[ styles.marginVertical_10 ]}>
                                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.Width_100 ]}>
                                                <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                                <TouchableOpacity onPress     = {() => this.props.navigation.navigate('DetailsCart' , {provider_id:cart.provider_id})}>
                                                    <View style={[ styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                                        <View style={[ styles.height_70 , styles.flex_25, styles.overHidden, styles.flexCenter, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                                            <Image style = {[styles.Width_100 , styles.height_70]} source={{uri:cart.avatar}}/>
                                                        </View>
                                                        <View style={[ styles.flex_75 ]}>
                                                            <View style={[ styles.rowGroup]}>
                                                                <Text style={[styles.textRegular, styles.text_red, styles.textSize_13, styles.paddingHorizontal_5]}>
                                                                    {cart.name}
                                                                </Text>
                                                            </View>
                                                            <Text style={[styles.textRegular, styles.text_light_gray, styles.textSize_13, styles.paddingHorizontal_5]}>
                                                                {cart.category}
                                                            </Text>
                                                            <View style={[ styles.rowRight]}>
                                                                <Icon style={[styles.textSize_12, styles.text_black_gray, styles.marginHorizontal_5]} type="Feather" name='map-pin' />
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13]}>
                                                                    {(cart.address).substr(0,30)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </Animatable.View>
                                        </View>
                                    ))
                                    :
                                    null
                            }
                        </View>

                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ auth, profile, lang , carts }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        carts: carts.carts,
    };
};
export default connect(mapStateToProps, {getCarts})(Cart);
