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
    Toast,
    Item,
    Input,
    Title,
    CheckBox, Form
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getOrders} from "../actions";
import * as Animatable from 'react-native-animatable';
import COLORS from "../consts/colors";
import {NavigationEvents} from "react-navigation";

class MyOrders extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader: true,
            active                  : 1,
        }
    }

    componentWillMount() {
        this.setState({loader: true});
        this.onActive(this.state.active);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false });
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
        if (this.props.orders && (this.props.orders).length <= 0) {
            return (
                <View style={[styles.flexColumnCenter , styles.Width_100 , {height:'70%'}]}>
                    <Image source={require('../../assets/img/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return <View/>
    }

    onActive ( id ){
        this.setState({active: id, loader: true});
        const token = this.props.user ? this.props.user.token : null;
        this.props.getOrders(this.props.lang, id, token)
    }


    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('myorder')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/file.png')} resizeMode={'contain'}/>)
    });
    onFocus(){
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
                            { i18n.t('myorder') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>


                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>

                        <View style={[ styles.rowGroup, styles.overlay_white, styles.Width_95, styles.paddingHorizontal_5]}>
                            <TouchableOpacity
                                style           = {[ styles.paddingHorizontal_5, styles.paddingVertical_5, ( this.state.active === 1  ? styles.border_top : '' ) ]}
                                onPress         = {() => this.onActive(1)}
                            >
                                <Text style={[ styles.textRegular, styles.textSize_14, ( this.state.active === 1 ? styles.text_red : styles.text_black )]}>
                                    { i18n.t('underProssess') }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style           = {[ styles.paddingHorizontal_5, styles.paddingVertical_5, ( this.state.active === 2  ? styles.border_top : '' ) ]}
                                onPress         = {() => this.onActive(2)}
                            >
                                <Text style={[ styles.textRegular, styles.textSize_14, ( this.state.active === 2 ? styles.text_red : styles.text_black )]}>
                                    { i18n.t('accepted') }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style           = {[ styles.paddingHorizontal_5, styles.paddingVertical_5, ( this.state.active === 3  ? styles.border_top : '' ) ]}
                                onPress         = {() => this.onActive(3)}
                            >
                                <Text style={[ styles.textRegular, styles.textSize_14, ( this.state.active === 3 ? styles.text_red : styles.text_black )]}>
                                    { i18n.t('done') }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style           = {[ styles.paddingHorizontal_5, styles.paddingVertical_5, ( this.state.active === 4  ? styles.border_top : '' ) ]}
                                onPress         = {() => this.onActive(4)}
                            >
                                <Text style={[ styles.textRegular, styles.textSize_14, ( this.state.active === 4 ? styles.text_red : styles.text_black )]}>
                                    { i18n.t('canceled') }
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[ styles.Width_90, styles.flexCenter, styles.marginVertical_30 ]}>
                            {this.renderNoData()}
                        {
                            this.props.orders?
                                this.props.orders.map((order , i) => (
                                        <View key={i} style={[ styles.marginVertical_10 ]}>
                                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.Width_100 ]}>
                                                <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                                <TouchableOpacity onPress = {() => this.props.navigation.navigate('DetailsOrder', {status : this.state.active , order_id : order.id})}>
                                                    <View style={[ styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                                        <View style={[ styles.flex_100 ]}>
                                                            <View style={[ styles.rowGroup]}>
                                                                <Text style={[styles.textRegular, styles.text_red, styles.textSize_13, styles.paddingHorizontal_5]}>
                                                                    {order.provider_name}
                                                                </Text>
                                                            </View>
                                                            <View style={[ styles.rowRight]}>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_100]}>
                                                                    { i18n.t('numorders') }
                                                                </Text>
                                                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                    {order.id}
                                                                </Text>
                                                            </View>
                                                            <View style={[ styles.rowRight]}>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_100]}>
                                                                    { i18n.t('numpage') }
                                                                </Text>
                                                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                    {order.items_count}
                                                                </Text>
                                                            </View>
                                                            <View style={[ styles.rowRight]}>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_100]}>
                                                                    { i18n.t('total') }
                                                                </Text>
                                                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                    {order.price} { i18n.t('RS') }
                                                                </Text>
                                                            </View>
                                                            <View style={[ styles.rowRight]}>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_100]}>
                                                                    { i18n.t('orderStatus') }
                                                                </Text>
                                                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                    {order.status_name}
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
const mapStateToProps = ({ auth, profile, lang , orders}) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        orders: orders.orders,
    };
};
export default connect(mapStateToProps, {getOrders})(MyOrders);
