/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Fabric/Fabric.h>
#import <TwitterKit/TwitterKit.h>
#import <GoogleSignIn/GoogleSignIn.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Jicheng8"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  [[Twitter sharedInstance] startWithConsumerKey:@"ewcswlzYnQPZqi8XPOxDvLgfc" consumerSecret:@"SvFgoj0l7yTyLwUNnpI2aiuWhA5WE5FXw2PTGdRC5KoyS5o0Tn"];
  [Fabric with:@[[Twitter class]]];
  [GIDSignIn sharedInstance].clientID = @"871409386922-een7v4oak4mon4lmmaum8ec5ugje3q4e.apps.googleusercontent.com";
//  [GIDSignIn sharedInstance].delegate = self;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.navigationController = [[UINavigationController alloc] initWithRootViewController:rootViewController];
  [self.navigationController setNavigationBarHidden:YES];
  [self.navigationController setToolbarHidden:YES];
  
  self.window.rootViewController = self.navigationController;
  
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  BOOL handledfb = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
  // 在此添加任意自定义逻辑。
  BOOL handledgi =[[GIDSignIn sharedInstance]handleURL:url sourceApplication:sourceApplication annotation:annotation];
  return handledfb || handledgi;
}

@end
