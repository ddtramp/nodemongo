/**
 * web api use csrf and session validate
 */
const crypt = require("./../../lib/crypto");
const sendEmail = require("./../../lib/send-email");
const uuidv4 = require("uuid/v4");
const RedisStroe = require("./../../lib/Store.js");
let Store = new RedisStroe();
const passport = require("./../../lib/passport-config");

module.exports = {
  "POST /web/register": async (ctx, next) => {
    try {
      let email = ctx.request.body.email.trim();
      let password = ctx.request.body.password.trim();
      if (email && password) {
        let res = await ctx.db.collection("users").findOne({ email });
        if (res) {
          ctx.body = {
            status: 403,
            data: null,
            message: "The account is exist.",
          };
        } else {
          let passwd = await crypt.hash(password);
          let user = await ctx.db.collection("users").insertOne({
            email,
            password: passwd,
          });
          await ctx.acl.addUserRoles(user.insertedId.toString(), ["user"]);
          let session = Object.assign(
            {},
            {
              _id: user.insertedId.toString(),
              email,
            }
          );
          ctx.session = { user: session, remember: true };
          ctx.body = {
            status: 200,
            data: session,
            message: "success",
          };
        }
      } else {
        ctx.body = {
          status: 403,
          data: null,
          message: "Need Email and Password",
        };
      }
      ctx.type = "application/json";
    } catch (e) {
      ctx.throw(500, "Bad parameter");
      next();
    }
  },
  "POST /web/login": async (ctx, next) => {
    try {
      let body = ctx.request.body;
      let email = body.username.trim();
      let password = body.password.trim();
      let remember = body.remember;
      let data = {
        email,
        password,
        remember,
      };
      let rule = {
        email: "email",
        password: "string",
        remember: {
          required: false,
          type: "string",
        },
      };
      let errors = ctx.validator.validate(rule, data);
      if (!errors) {
        return passport.authenticate("local", async function (
          err,
          user,
          info,
          status
        ) {
          // console.log(err, user, info, status)
          if (err) {
            ctx.throw(500);
          }
          if (user) {
            await ctx.login(user);
            console.log("ctx.state.user", ctx.state.user);

            ctx.body = {
              status: 200,
              body: user,
              message: "success",
            };
          }
        })(ctx, next);
      } else {
        ctx.response.body = {
          status: 403,
          data: errors,
          message: "Parameters Error",
        };
      }
      ctx.response.type = "application/json";
      await next();
    } catch (e) {
      ctx.throw(500, "Bad Parameters", e);
      await next();
    }
  },
  "POST /web/reset": async (ctx, next) => {
    try {
      let body = ctx.request.body;
      let email = body.email.trim();
      let data = { email };
      let rules = { email: "email" };
      let errors = ctx.validator.validate(rules, data);
      if (!errors) {
        let user = await ctx.db.collection("users").findOne({ email });
        if (user) {
          let token = uuidv4();
          Store.set(user, { sid: token });
          const url = `${ctx.origin}/reset/${user._id}/${token}`;
          let res = await sendEmail(
            "122825619@qq.com",
            email,
            "Reset Password",
            "Please open this link reset you password",
            `Please open this link in 5 minutes, <a href="${url}">${url}</a>`
          );
          if (res) {
            ctx.body = {
              status: 401,
              body: null,
              message: "Send Email failed.",
            };
          }
          ctx.body = {
            status: 200,
            body:
              "Please check you inbox and click on the link to verify you email and reset you password",
            message: "Send Email ok",
          };
        } else {
          ctx.body = {
            status: 401,
            data: null,
            message: "The Email Does Not Exist.",
          };
        }
      } else {
        ctx.body = {
          status: 403,
          data: errors,
          message: "Wrong Parameters.",
        };
      }
      ctx.type = "application/json";
    } catch (e) {
      console.log(e);
      ctx.logger.error(e);
      ctx.throw(500);
    }
  },
  "GET /web/refreshCrsf": async (ctx, next) => {
    // TODO get crsf token
  },
  "GET /web/logout": async (ctx, next) => {
    try {
      ctx.logout();
      ctx.response.body = {
        status: 200,
        data: null,
        message: "success",
      };

      ctx.cookies.set("remenber", null);
    } catch (e) {
      ctx.throw(500, "Server internal error");
    }
  },
};
