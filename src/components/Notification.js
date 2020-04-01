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
import {getNotifications , deleteNotifications} from "../actions";
import COLORS from "../consts/colors";
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import Spinner from "./Home";
import {NavigationEvents} from "react-navigation";

const isIOS = Platform.OS === 'ios';

class Notification extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader: true
        }
    }

    componentWillMount() {
        this.setState({loader: true});
        this.props.getNotifications(this.props.lang , this.props.user.token)
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

    deleteNotify(notify_id){
        this.props.deleteNotifications( this.props.lang , notify_id , this.props.user.token )
    }
    renderNoData() {
        if (this.props.notifications && (this.props.notifications).length <= 0) {
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
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('Notifications') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, { top : -30 } ]}>

                        <View style={[ styles.Width_90, styles.flexCenter, styles.marginVertical_30 ]}>
                            {this.renderNoData()}
                            {
                                this.props.notifications ?
                                    this.props.notifications.map((notification, i) => (
                                        <View key={i} style={[ styles.marginVertical_10 ]}>
                                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.Width_100 ]}>
                                                <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                                <View>
                                                    <View style={[ styles.rowGroup, styles.bg_White, i % 2 === 0 ? styles.borderRed : styles.borderBlack ,styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                                        <View style={[ styles.Width_100 ]}>
                                                            <View style={[ styles.rowGroup, styles.marginVertical_5]}>
                                                                <Text style={[styles.textRegular, styles.text_black, styles.textSize_14]} numberOfLines = { 1 } prop with ellipsizeMode = "tail">
                                                                    {notification.title}
                                                                </Text>
                                                                <TouchableOpacity  onPress = {() => this.deleteNotify(notification.id)} style={[ styles.paddingVertical_5, styles.paddingHorizontal_5 ]}>
                                                                    <Icon style={[styles.textSize_16, styles.text_red]} type="AntDesign" name='closecircle' />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={[ styles.rowGroup]}>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_12 , styles.Width_86]}>
                                                                    {notification.body}
                                                                </Text>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_12 , {right:5 , position:'absolute' , bottom:0}]} >
                                                                    {notification.created_at}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
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

const mapStateToProps = ({ notifications, lang , profile }) => {
    return {
        lang        : lang.lang,
        user        : profile.user,
        notifications : notifications.notifications,
        loader      : notifications.loader
    };
};
export default connect(mapStateToProps, {getNotifications , deleteNotifications})(Notification);
