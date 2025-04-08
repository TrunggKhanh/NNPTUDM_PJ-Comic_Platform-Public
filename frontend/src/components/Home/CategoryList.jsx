import { Link } from 'react-router-dom';

const CategoryList = ({ categories , title}) => {
    return (
        <section className="new-update sections " id="update">
            <div className="update__container grids">
                <div className="top__content">
                    <div className="title-infor">
                        <span className="section__subtitle">{title}</span>
                        <p className="section__des"></p>
                    </div>
                </div>
                {/* <div className="containers"> */}
                    <div className="row w-100 position-relative">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/${category._id}`} 
                                className="col-auto item-loai"
                            >
                                {category.ten_loai} 
                            </Link>
                        ))}
                    </div>
                </div>
            {/* </div> */}
        </section>
    );
};

export default CategoryList;
