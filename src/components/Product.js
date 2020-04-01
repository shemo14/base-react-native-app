import React, { Component } from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import {Right, Left, ListItem, CheckBox, Icon} from 'native-base';
import * as Animatable from "react-native-animatable";
import styles from "../../assets/style";
import i18n from "../../locale/i18n";
import StarRating from "react-native-star-rating";
import COLORS from "../consts/colors";
import {connect} from "react-redux";
import { setFav } from '../actions';


class Product extends Component{
    constructor(props){
        super(props);
        this.state = {
            isFav: this.props.data.is_favourite
        }
    }

    toggleFavorite (id){
        this.setState({ isFav: ! this.state.isFav });
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.setFav( this.props.lang, id  , token );
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ isFav: nextProps.data.is_favourite  });
    }

    onPressMeal(){
        if( this.props.type){
            this.props.rerunAction(this.props.data.id)
        }
        else {
            this.props.navigation.navigate(this.props.user?'Details':'Login' , {meal_id:this.props.data.id})
        }
    }

    render(){
        return(
            <View
                style={[styles.overHidden, styles.Width_47, styles.marginHorizontal_5, styles.marginVertical_5]}>
                <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}
                                 style={[styles.Width_100]}>
                    <TouchableOpacity
                        onPress={() => this.onPressMeal()}
                        style={[styles.position_R, styles.Width_100, styles.Border, styles.border_gray, styles.paddingVertical_5, styles.paddingHorizontal_5]}>
                        <View style={[styles.Width_100, styles.position_R]}>
                            <Image style={[styles.Width_100, styles.height_100]}
                                   source={{uri: this.props.data.image}}/>
                            <View
                                style={[styles.Width_100, styles.position_A, styles.right_0, styles.bottom_0, styles.paddingHorizontal_5, styles.paddingVertical_5, styles.overlay_black, styles.rowGroup]}>
                                <View style={[styles.rowRight]}>
                                    <Icon
                                        style={[ this.props.data.available? styles.text_green : styles.text_red, styles.textSize_5, styles.marginHorizontal_5]}
                                        type="FontAwesome"
                                        name='circle'
                                    />
                                    <Text
                                        style={[styles.textRegular, styles.text_White, styles.textSize_10]}
                                        numberOfLines={1} prop with ellipsizeMode="tail">
                                        {this.props.data.provider_name}
                                    </Text>
                                </View>
                                {
                                    this.props.user?
                                        <TouchableOpacity onPress = {() => this.toggleFavorite(this.props.data.id)}>
                                            <Icon style={[this.state.isFav ? styles.text_red : styles.text_gray, styles.textSize_18]} type="AntDesign" name={this.state.isFav ? 'heart' : 'hearto'} />
                                        </TouchableOpacity>
                                        :
                                        null
                                }
                            </View>
                        </View>
                        <View style={[styles.Width_100, styles.marginVertical_5]}>
                            <View style={[styles.rowGroup, styles.marginVertical_5]}>
                                <Text
                                    style={[styles.textRegular, styles.text_red, styles.textSize_12]}>{(this.props.data.title).substr(0,13)}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={this.props.data.reviews}
                                    fullStarColor={COLORS.red}
                                    starSize={12}
                                    starStyle={styles.starStyle}
                                />
                            </View>
                            <View style={[styles.rowGroup]}>
                                <Text
                                    style={[styles.textRegular, styles.text_black, styles.textSize_12]}>{this.props.data.price} { i18n.t('RS') }</Text>
                                <Text
                                    style={[styles.textRegular, styles.text_light_gray, styles.textSize_12]}>{this.props.data.distance}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        )
    }
}

const mapStateToProps = ({ lang, profile }) => {
    return {
        lang        : lang.lang,
        user		: profile.user,
    };
};
export default connect(mapStateToProps, {setFav})(Product);