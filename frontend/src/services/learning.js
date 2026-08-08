import API from "./api";

export async function simplifyLesson(chapter, content) {

    const response = await API.post("/learning/simplify", {

        chapter,

        content

    });

    return response.data;

}
export async function askDoubt(chapter, question) {

    const response = await API.post("/learning/doubt", {

        chapter,

        question

    });

    return response.data;

}