import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator,} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Right,
    Title, CheckBox,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getFavorites} from "../actions";
import * as Animatable from 'react-native-animatable';
import StarRating from "react-native-star-rating";
import COLORS from "../consts/colors";
import Modal from "react-native-modal";
import Product from './Product'
import {NavigationEvents} from "react-navigation";

class Favorite extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader: true,
        }
    }

    componentWillMount() {
        this.setState({loader: true});
        const token = this.props.user ? this.props.user.token : null;
        this.props.getFavorites(this.props.lang, this.props.auth.data.latitude , this.props.auth.data.longitude , token);
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

    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('fav')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/heart.png')} resizeMode={'contain'}/>)
    });

    renderNoData() {
        if (this.props.favorites && (this.props.favorites).length <= 0) {
            return (
                <View style={[styles.flexColumnCenter , styles.Width_100 , {height:'95%'}]}>
                    <Image source={require('../../assets/img/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return <View/>
    }
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
                            { i18n.t('fav') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_80, styles.right_0, styles.top_0 ]}/>

                    <View style={[ styles.rowGroup, styles.paddingHorizontal_10, styles.marginVertical_10, styles.overHidden, styles.Width_100 ]}>
                        {this.renderNoData()}
                        {
                            this.props.favorites ?
                                this.props.favorites.map((meal, i) => (
                                    <Product key={meal.id} data={meal} navigation={this.props.navigation} />
                                ))
                                :
                                null
                        }

                    </View>

                </Content>

            </Container>

        );
    }
}


const mapStateToProps = ({ auth, profile, lang , favorites}) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        favorites: favorites.favorites,
    };
};
export default connect(mapStateToProps, {getFavorites})(Favorite);

