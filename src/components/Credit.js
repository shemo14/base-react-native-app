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
import {getBill , payTax} from "../actions";
import Spinner from "react-native-loading-spinner-overlay";
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from "react-navigation";
import BillCheckItem from './BillCheckItem'
import COLORS from "../consts/colors";

class Credit extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                 : false,
            active                  : 1,
            selectId                : 0,
            checkedItems            : [],
            isSubmitted             : false,
        }
    }

    componentWillMount() {
        // alert(this.state.checkedItems.length)
        this.setState({ isSubmitted: false });
        this.props.getBill(this.props.lang , this.props.user.token);
    }

    renderConfirm(){
        if (this.state.checkedItems.length === 0){
            return (
                <View
                    style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40, {backgroundColor:"#999"}]}>
                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                        {i18n.translate('confirm')}
                    </Text>
                </View>
            );
        }
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginVertical_15]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40]}
                onPress={() => this.onConfirm()}>
                <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                    {i18n.translate('confirm')}
                </Text>
            </TouchableOpacity>
        );
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});

    }
    onActive ( id ){
        this.setState({active : id });
    }

    addToCheckList(id){
        let itemsList = this.state.checkedItems;
        const found = itemsList.some(itemId => itemId === id);
        if (!found){
            itemsList.push(id);
        }else{
            itemsList = itemsList.filter(itemId => itemId !== id);
        }

        this.setState({ checkedItems: itemsList });
    }

    onConfirm(){
        this.setState({ isSubmitted: true });
        this.props.payTax(this.props.lang , this.state.checkedItems , this.props.user.token)
    }

    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('credit')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/credit.png')} resizeMode={'contain'}/>)
    });

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
                            { i18n.t('credit') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>

                        <View style={[ styles.rowGroup, styles.overlay_white, styles.Width_95, styles.paddingHorizontal_5]}>
                            <TouchableOpacity
                                style           = {[ styles.paddingHorizontal_5, styles.paddingVertical_5, styles.flex_1 , ( this.state.active === 1  ? styles.border_top : '' ) ]}
                                onPress         = {() => this.onActive(1)}
                            >
                                <Text style={[ styles.textRegular, styles.textSize_14, styles.textCenter ,( this.state.active === 1 ? styles.text_red : styles.text_black )]}>
                                    { i18n.t('deservedAmount') }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style           = {[ styles.paddingHorizontal_5, styles.paddingVertical_5, styles.flex_1 , ( this.state.active === 2  ? styles.border_top : '' ) ]}
                                onPress         = {() => this.onActive(2)}
                            >
                                <Text style={[ styles.textRegular, styles.textSize_14, styles.textCenter , ( this.state.active === 2 ? styles.text_red : styles.text_black )]}>
                                    { i18n.t('bepaid') }
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {
                            this.props.bill?
                                (this.state.active === 1) ?
                                    <View style={[ styles.Width_90, styles.flexCenter, styles.marginVertical_30 ]}>
                                        <View style={[ styles.marginVertical_10 ]}>
                                            <Text style={[ styles.textRegular, styles.textSize_14, styles.textCenter ,styles.text_red , styles.marginVertical_5]}>
                                                { i18n.t('deservedAmount') }
                                            </Text>
                                            <Text style={[ styles.textRegular, styles.textSize_14, styles.textCenter ,styles.text_red , {marginBottom:25}]}>
                                                {this.props.bill.total_income} { i18n.t('RS') }
                                            </Text>

                                            {
                                                this.props.bill.income ?
                                                    this.props.bill.income.map((bill, i) => (
                                                        <Animatable.View key={i} animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.Width_100 , styles.marginVertical_10 ]}>
                                                            <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                                            <View style={[ styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray, styles.paddingHorizontal_10, styles.paddingVertical_10 ]}>
                                                                <View style={[ styles.flex_100 ]}>
                                                                    <View style={[ styles.rowRight]}>
                                                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_120]}>
                                                                            { i18n.t('numorders') }
                                                                        </Text>
                                                                        <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                            {bill.id}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={[ styles.rowRight]}>
                                                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_120]}>
                                                                            { i18n.t('deservedAmount') }
                                                                        </Text>
                                                                        <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                                                        <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                            {bill.price} { i18n.t('RS') }
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </Animatable.View>
                                                    ))
                                                    :
                                                    null
                                            }

                                        </View>
                                    </View>
                                    :
                                    <View style={[ styles.Width_90, styles.flexCenter, styles.marginVertical_30 ]}>
                                    <View style={[ styles.marginVertical_10 ]}>
                                        <Text style={[ styles.textRegular, styles.textSize_14, styles.textCenter ,styles.text_red , styles.marginVertical_5]}>
                                            { i18n.t('bepaid') }
                                        </Text>
                                        <Text style={[ styles.textRegular, styles.textSize_14, styles.textCenter ,styles.text_red , {marginBottom:25}]}>
                                            {this.props.bill.total_outcome} { i18n.t('RS') }
                                        </Text>

                                        {
                                            this.props.bill.outcome ?
                                                this.props.bill.outcome.map((bill, i) => (
                                                    <BillCheckItem addItem={(id) => this.addToCheckList(id)} key={bill.id} data={bill}/>
                                                ))
                                                :
                                                null

                                        }

                                        {
                                            this.renderConfirm()
                                        }

                                    </View>
                                </View>
                                :
                                null
                        }

                    </View>

                </Content>

            </Container>

        );
    }
}


const mapStateToProps = ({ auth, profile, lang , bill }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        bill: bill.bill,
    };
};
export default connect(mapStateToProps, {getBill , payTax})(Credit);