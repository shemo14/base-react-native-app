import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ActivityIndicator} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Form, Textarea, Icon,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getBankAcoounts , deleteBankAcoounts} from "../actions";
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";
import COLORS from "../consts/colors";

class BankAccounts extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                     : false,
            Error                       : '',
            massage                     : '',
            loader: true
        }
    }

    componentWillMount() {
        this.setState({loader: true});
        this.props.getBankAcoounts(this.props.lang , this.props.user.token)
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
        if (this.props.bankAcoounts && (this.props.bankAcoounts).length <= 0) {
            return (
                <View style={[styles.flexColumnCenter , styles.Width_100 , {height:'70%'}]}>
                    <Image source={require('../../assets/img/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return <View/>
    }


    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('thebank')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/coin.png')} resizeMode={'contain'}/>)
    });

    deleteBank(bankId){
        this.props.deleteBankAcoounts( this.props.lang , bankId , this.props.user.token )
    }
    render() {

        return (
            <Container>
                {this.renderLoader()}
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('thebank') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>

                        <View style={[styles.paddingHorizontal_5, styles.marginHorizontal_15, styles.paddingVertical_25]}>
                            {this.renderNoData()}
                            {
                                this.props.bankAcoounts?
                                    this.props.bankAcoounts.map((bank, i) => (
                                            <View key={i} style={[styles.Border, styles.border_gray, styles.bg_White, styles.paddingHorizontal_15, styles.SelfLeft, styles.Width_100 , {marginBottom:20}]}>
                                                <View style={[styles.overHidden]}>
                                                    <Image style={[styles.icImg]}
                                                           source={{uri : bank.bank_image}}
                                                           resizeMode={'contain'}/>
                                                </View>
                                                <TouchableOpacity
                                                    onPress         = {() => this.props.navigation.navigate('editBankAcc' ,
                                                        {id:bank.id , national_id:bank.national_id , image:bank.image , account_number:bank.account_number ,
                                                            iban_number : bank.iban_number , bank_id: bank.bank_id, bank: bank.bank_name})}
                                                    style={{width: 18, height: 18, position: 'absolute', right: 5, top: 5}}>
                                                    <Image style={{width: '100%', height: '100%'}}
                                                           source={require('../../assets/img/edit.png')}
                                                           resizeMode={'contain'}/>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => this.deleteBank(bank.id)}
                                                    style={{position: 'absolute', right: 5, bottom: 5}}>
                                                    <Icon style={[styles.textSize_16, styles.text_red]} type="AntDesign"
                                                          name='closecircle'/>
                                                </TouchableOpacity>

                                                <View style={[styles.overHidden, styles.marginHorizontal_10]}>
                                                    <View style={[styles.rowGroup]}>
                                                        <Text
                                                            style={[styles.textRegular, styles.textSize_14, styles.text_black_gray , styles.width_150]}>{i18n.t('namebank')} :
                                                            {bank.bank_name}</Text>
                                                    </View>
                                                    <View style={[styles.rowGroup]}>
                                                        <Text
                                                            style={[styles.textRegular, styles.textSize_14, styles.text_black_gray]}>{i18n.t('accNum')} :
                                                            {bank.account_number}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                    ))
                                    :
                                    null
                            }

                        </View>

                        <TouchableOpacity
                            style       = {[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_25, styles.height_40, styles.zIndex]}
                            onPress     = {() => this.props.navigation.navigate('FormBank')}>
                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                {i18n.translate('newAcc')}
                            </Text>
                        </TouchableOpacity>

                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ bankAcoounts, lang , profile }) => {
    return {
        lang        : lang.lang,
        user        : profile.user,
        bankAcoounts : bankAcoounts.bankAcoounts,
        loader      : bankAcoounts.loader
    };
};
export default connect(mapStateToProps, {getBankAcoounts , deleteBankAcoounts})(BankAccounts);
