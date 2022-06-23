import Avatar from "./img/kipicenko.jpg";
import AvatarWebP from "./img/kipicenko.webp";

function App() {

    return (
        <div className="wrapper">
            <div className="wrapper-container">
                <div className="wrapper-container__block">
                    <div className="kipicenko-container-img">
                        <picture>
                            <source srcSet={AvatarWebP} type="image/webp" />
                            <img loading="lazy" src={Avatar} alt="avatar" />
                        </picture>
                    </div>
                    <h1 className="text">Cборка webpack 5</h1>
                    <div className="info">
                        <div>My repository: </div>
                        <a href="https://github.com/Kipicenko/webpack-assembly.git">https://github.com/Kipicenko/webpack-assembly.git</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;