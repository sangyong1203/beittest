import axios from "axios"
import router from "@router/index"

// 인스턴스 생성 : .create() 메서드를 사용해 사용자 정의 구성을 사용하는 axios 인스턴스를 생성할 수 있다.
const instance = axios.create({
    baseURL: "https://wpgumi.com/api/", // 본 서버
    // baseURL: "http://192.168.0.123:8086/api/", // 경류
    // baseURL: "http://211.212.221.99:8085/api/", // 경류 (외부망)
    // baseURL: "http://192.168.0.91:8086/api/", // 탁근
    // baseURL: "http://192.168.0.9:8085/api/", // 민호
    timeout: 5000,
})

// 인터셉터의 역할
// - server로부터 response를 받은 후에 호출된다.
// - response의 data를 가공 및 수정하기
// - 에러 핸들링
// - 로깅
// - 로딩 상태관리
// - 상태관리(store | state)
// - response를 작업 중인 코드(프로젝트)에 반영하기 전에 할 수 있는 기타 작업들

// 요청 인터셉터 추가하기
instance.interceptors.request.use(
    function (config:any) {

        let data = config.data
        let formData = new FormData()
        console.log("config", data)
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                if (key !== "files") {
                    if (typeof value === "string" || value instanceof Blob) {
                        formData.append(key, value)
                    } else if (typeof value === "number" || typeof value === "boolean") {
                        formData.append(key, String(value))
                    }
                }
            })

            let fileName = data.fileName || "files"
            let files = data.files || []

            if (files) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i]

                    if (file) {
                        formData.append(fileName, file)
                    }
                }
            }
            config.data = formData
        }
        return config
    },
    function (error:any) {
        // 요청 오류가 있는 작업 수행
        return Promise.reject(error)
    }
)

// 응답 인터셉터 추가하기
instance.interceptors.response.use(
    function (response:any) {
        let rsCode = response.data.rsCode
        console.log("rsCode", rsCode)
        if (rsCode === 1002) {
            localStorage.removeItem("main")
            router.replace({ name: "login", query: { showAlert: "true" } })
        }
        // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 한다.
        // 응답 데이터가 있는 작업 수행
        return response
    },
    function (error:any) {
        // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 오류가 있는 작업 수행
        return Promise.reject(error)
    }
)

export default {
    get(url: string, params: any) {
        return instance({
            method: "GET",
            url: url,
            params: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    },
    post(url: string, params: any) {
        return instance({
            method: "POST",
            url: url,
            data: params,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },
    delete(url: string, params: any) {
        return instance({
            method: "DELETE",
            url: url,
            data: params,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },
    put(url: string, params: any) {
        return instance({
            method: "PUT",
            url: url,
            data: params,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },
}
