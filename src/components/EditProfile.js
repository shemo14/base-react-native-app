import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Right, Icon, Form, Item, Input, CheckBox, Toast,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getDeliveryTypes , getCountries , updateProfile , getGenders} from "../actions";
import Modal from "react-native-modal";
import {NavigationEvents} from "react-navigation";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import DateTimePicker from "react-native-modal-datetime-picker";
import COLORS from "../consts/colors";

let deliveryArr = [];

class EditProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            name                        : this.props.user.name,
            phone                       : this.props.user.phone,
            qualification               : this.props.user.qualification,
            country                     : this.props.user.country,
            countryId                   : this.props.user.country_id,
            nationality                 : this.props.user.gender,
            nationalityId               : this.props.user.gender_id,
            date                        : this.props.user.birthday,
            userId                      : null,
            type                        : 0,
            nameStatus                  : 1,
            phoneStatus                 : 1,
            qualificationStatus         : 1,
            spinner                     : false,
            isModalCountry              : false,
            isModalNationality          : false,
            cityName                    : this.props.user.address,
            userImage                   : this.props.user.avatar,
            latitude                    : this.props.user.latitude,
            longitude                   : this.props.user.longitude,
            base64                      : '',
            active                      : null,
            deliveryTypesArr            : this.props.user.delivery_types,
            isSubmitted: false,
            deliveryArr,
        }
    }
    componentWillMount() {
        console.log('this.state.deliveryTypesArr' , this.state.deliveryTypesArr)
        this.setState({ isSubmitted: false });
        this.props.getDeliveryTypes(this.props.lang);
        this.props.getCountries(this.props.lang);
        this.props.getGenders(this.props.lang);
    }

    activeInput(type) {

        if (type === 'name' || this.state.name !== '') {
            this.setState({nameStatus: 1})
        }

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

        if (type === 'qualification' || this.state.qualification !== '') {
            this.setState({qualificationStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'name' && this.state.name === '') {
            this.setState({nameStatus: 0})
        }

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

        if (type === 'qualification' || this.state.qualification !== '') {
            this.setState({qualificationStatus: 0})
        }
    }


    onEditPressed() {
        this.setState({ isSubmitted: true });
        const data = {
            name                : this.state.name,
            email               : null,
            phone               : this.state.phone,
            country_id          : this.state.countryId,
            gender              : this.state.nationalityId,
            latitude            : this.state.latitude,
            longitude           : this.state.longitude,
            avatar              : this.state.base64,
            cover               : null,
            provider_details    : null,
            available           : this.props.user.available,
            delivery_types      : this.state.deliveryArr,
            qualification       : this.state.qualification,
            address             : this.state.cityName,
            lang                : this.props.lang,
            token               : this.props.user.token,
            props               : this.props,
        };


        this.props.updateProfile(data);
    }

    renderEdit(){
        if (this.state.name == '' || this.state.phone == ''){
            return (
                <View
                    style={[styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red , {backgroundColor:"#999"}]}>
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
                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                onPress     = {() => this.onEditPressed()}
            >
                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                    { i18n.t('confirm') }
                </Text>
            </TouchableOpacity>
        );
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
            checked2     : id,
            country     : name
        });
        this.state.countryId = id;
        this.setState({ isModalCountry: !this.state.isModalCountry});
    }

    toggleModalNationality = () => {
        this.setState({ isModalNationality: !this.state.isModalNationality});
    };

    selectNationalityId(id, name) {
        this.setState({
            checked        : id,
            nationality     : name,
            nationalityId     : id,
        });
        // this.state.nationalityId = id;
        this.setState({ isModalNationality: !this.state.isModalNationality});
    }

    getLocation(){

        this.props.navigation.navigate('MapLocation', {
            pageName : this.props.navigation.state.routeName
        });

    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _pickImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true
        });

        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64});
        }
    };

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

    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});
        if( nextProps.navigation.state.params !== undefined ||  nextProps.navigation.state.params  !== undefined){
            this.state.cityName             = nextProps.navigation.state.params.city_name;
            this.setState({latitude   : nextProps.navigation.state.params.latitude});
            this.setState({longitude  : nextProps.navigation.state.params.longitude});
        }else{
            this.setState({cityName  : this.props.user.address});
        }

        this.setState({ isModalFilter   : !this.state.isModalFilter});

    }

    onFocus(){
        this.componentWillMount();
    }

    render() {

        let image = this.state.userImage;

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('editAcc') }
                        </Title>
                    </Body>
                    <Right style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type={'AntDesign'} name={'close'} style={[ styles.text_red, styles.textSize_26 ]}/>
                        </Button>
                    </Right>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>

                        <View style={[ styles.position_R, styles.overHidden,styles.Width_85, styles.height_200, styles.flexCenter ]}>
                            <View style={[ styles.position_A, styles.top_0, styles.right_0, styles.overlay_black, styles.Width_100, styles.height_full, styles.zIndex ]} />
                            <TouchableOpacity
                                style={[styles.width_40, styles.height_40, styles.overlay_white, styles.flexCenter, styles.position_A, styles.left_0, styles.top_20, styles.zIndex]}
                                onPress={this._pickImage}
                            >
                                <Icon style={[styles.text_White, styles.textSize_20]} type="AntDesign" name='plus' />
                            </TouchableOpacity>
                            <View style={[ styles.overHidden,styles.Width_100, styles.height_200, styles.flexCenter, styles.position_R]}>
                                <Image style={[styles.Width_100, styles.height_200]} source={{ uri: image }} resizeMode={'cover'}/>
                            </View>
                        </View>

                        <View style={[ styles.marginVertical_10, styles.Width_85, styles.flexCenter ]}>
                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_100]}>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('userName')}
                                            style={[styles.input, styles.height_50, (this.state.nameStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(name) => this.setState({name})}
                                            onBlur={() => this.unActiveInput('name')}
                                            onFocus= {() => this.activeInput('name')}
                                            value= {this.state.name}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('phone')}
                                            style={[styles.input, styles.height_50, (this.state.phoneStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(phone) => this.setState({phone})}
                                            onBlur={() => this.unActiveInput('phone')}
                                            onFocus={() => this.activeInput('phone')}
                                            keyboardType={'number-pad'}
                                            value= {this.state.phone}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.overHidden, styles.rowGroup]}>
                                    <TouchableOpacity onPress={() => this.toggleModalNationality()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.nationalityId !== null ? styles.border_red :  styles.border_gray )]}>
                                        <Text style={[styles.textRegular, styles.textSize_14, (this.state.nationalityId !== null ? styles.text_red :  styles.text_black )]}>
                                            { this.state.nationality }
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
                                    </TouchableOpacity>
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

                                {
                                    this.props.user != null && this.props.user.type === 'provider' ?

                                        <View style={[styles.overHidden, styles.rowGroup]}>
                                            <TouchableOpacity onPress={this.toggleDatePicker}
                                                              style={[styles.marginVertical_10, styles.Width_100, styles.height_50, styles.paddingHorizontal_20, styles.paddingVertical_10, styles.rowGroup, styles.Border, (this.state.date !== '' ? styles.border_red : styles.border_gray)]}>
                                                <Text
                                                    style={[styles.textRegular, styles.textSize_14, (this.state.date !== '' ? styles.text_red : styles.text_black)]}>
                                                    {i18n.translate('birthday')} : {this.state.date}
                                                </Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]}
                                                      type="AntDesign" name='calendar'/>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        null
                                }

                                < DateTimePicker
                                isVisible = {this.state.isDatePickerVisible}
                                onConfirm       = {this.doneDatePicker}
                                onCancel        = {this.toggleDatePicker}
                                mode            = {'date'}
                                minimumDate     = {new Date()}
                                />


                                {
                                    this.props.user != null && this.props.user.type === 'provider' ?

                                        <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                            <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                <Input
                                                    placeholder={i18n.translate('qualification')}
                                                    style={[styles.input, styles.height_50, (this.state.qualificationStatus === 1 ? styles.Active : styles.noActive)]}
                                                    onChangeText={(qualification) => this.setState({qualification})}
                                                    onBlur={() => this.unActiveInput('qualification')}
                                                    onFocus= {() => this.activeInput('qualification')}
                                                    value= {this.state.qualification}
                                                />
                                            </Item>
                                        </View>

                                        :
                                        null
                                }
                                <View style={[styles.overHidden, styles.rowGroup]}>
                                    <TouchableOpacity onPress={() => this.toggleModalCountry()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border,  (this.state.countryId !== null ? styles.border_red :  styles.border_gray )]}>
                                        <Text style={[styles.textRegular, styles.textSize_14, (this.state.countryId !== null ? styles.text_red :  styles.text_black )]}>
                                            { this.state.country }
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
                                    </TouchableOpacity>
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
                                {
                                    this.props.user != null && this.props.user.type === 'provider' ?
                                        <View style={styles.Width_100}>
                                            <Text
                                                style={[styles.textRegular, styles.textSize_13, styles.text_black, styles.marginVertical_15, styles.Width_100]}>
                                                {i18n.t('delver')}
                                            </Text>

                                            <View style={[styles.height_40]}>
                                                <ScrollView style={[styles.scroll]} horizontal={true}
                                                            showsHorizontalScrollIndicator={false}>

                                                    {
                                                        this.props.deliveryTypes.map((type, i) => {
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
                                            </View>
                                        </View>
                                        :
                                        null
                                }

                                { this.renderEdit() }

                        </Form>
                            </KeyboardAvoidingView>
                        </View>
                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ lang , profile , deliveryTypes , countries , genders}) => {
    return {
        lang            : lang.lang,
        user            : profile.user,
        deliveryTypes   : deliveryTypes.deliveryTypes,
        countries       : countries.countries,
        genders         : genders.genders,
    };
};
export default connect(mapStateToProps, {getDeliveryTypes , getCountries , updateProfile , getGenders})(EditProfile);
