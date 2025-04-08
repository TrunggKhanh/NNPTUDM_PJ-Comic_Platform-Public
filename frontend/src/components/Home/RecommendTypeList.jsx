import { Link } from 'react-router-dom';
import manga from '../../assets/img/bg-4.jpg';
import manwa from '../../assets/img/bg-5.jpg';
import manhua from '../../assets/img/bg-3.jpg';
import adventure from '../../assets/img/bg-1.jpg';
import Comedy from '../../assets/img/bg-2.jpg';
import romantic from '../../assets/img/bg-6.jpg';
const RecommendTypeList = () => {
    return (
        <section className="new-update sections mt-3 mb-5" id="update">
            <div className="update__container TruyenNew__Containter grids">
                <div className="top__content">
                    <div className="title-infor">
                        <span className="section__subtitle">Loại Truyện Đề Cử</span>
                        <p className="section__des"></p>
                    </div>
                </div>
                <div className=" recommend__type">
                    <div className="row row-cols-3">
                        {/* Manga */}
                        <Link
                            className="col"
                            to="/67406eedc03445f471148216"
                        >
                            <div className="col-item">
                                <img
                                    loading="lazy"
                                    src={manga}
                                    alt="Manga"
                                />
                                <h5 className="recommend-content">
                                    Manga
                                </h5>

                            </div>
                        </Link>
                        {/* Manwa */}
                        <Link
                            className="col"
                            to="/67406ee5c03445f471148213"
                        >
                            <div className="col-item">
                                <img
                                    loading="lazy"
                                    src={manwa}
                                    alt="Manwa"
                                />
                                <h5 className="recommend-content">
                                    Manwa
                                </h5>
                            </div>
                        </Link>
                        {/* Manhua */}
                        <Link
                            className="col"
                            to="/boTruyen/ListTopic/Manhua"
                        >
                            <div className="col-item">
                                <img
                                    loading="lazy"
                                    src={manhua}
                                    alt="Adventure"
                                />
                                <h5 className="recommend-content">
                                Manhua
                                </h5>
                            </div>
                        </Link>
                        {/* Adventure */}
                        <Link
                            className="col"
                            to="/67406e97c03445f4711481f8"
                        >
                            <div className="col-item">
                                <img
                                    loading="lazy"
                                    src={adventure}
                                    alt="Adventure"
                                />
                                <h5 className="recommend-content">
                                    Adventure
                                </h5>
                            </div>
                        </Link>
                        {/* Comedy */}
                        <Link
                            className="col"
                            to="/67406ee0c03445f471148210"
                        >
                            <div className="col-item">
                                <img
                                    loading="lazy"
                                    src={Comedy}
                                    alt="Comedy"
                                />
                                <h5 className="recommend-content">
                                    Comedy
                                </h5>
                            </div>
                        </Link>
                        {/* Romantic */}
                        <Link
                            className="col"
                            to="/67406ed2c03445f47114820a"
                        >
                            <div className="col-item">
                                <img
                                    loading="lazy"
                                    src={romantic}
                                    alt="Romantic"
                                />
                                <h5 className="recommend-content">
                                    Romantic
                                </h5>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecommendTypeList;
