import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class PublishService {
    static async publishToWordPress(title: string, content: string, status: string = "draft") {
        const siteUrl = process.env.WP_SITE_URL;
        const username = process.env.WP_USERNAME;
        const appPassword = process.env.WP_APP_PASSWORD;

        if (!siteUrl || !username || !appPassword) {
            throw new Error("WordPress configuration missing in .env");
        }

        const apiUrl = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`;
        const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");

        const response = await axios.post(apiUrl, {
            title: title,
            content: content,
            status: status || "draft",
        }, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            }
        });

        return {
            success: true,
            url: `${siteUrl}/wp-admin/post.php?post=${response.data.id}&action=edit`
        };
    }
}
